import http from 'http';
import jwt from 'jsonwebtoken';
const WS = require('ws');

type WebSocketType = import('ws').WebSocket;

interface CustomWS extends WebSocketType {
  familyIds: string[];
}

const SECRET_KEY = process.env.JWT_SECRET;

const server = http.createServer();
const wss = new WS.Server({ noServer: true });

// Mapa: familyId → Set<WebSocket>
const families = new Map<string, Set<CustomWS>>();

function addSocketToFamily(familyId: string, ws: CustomWS) {
  if (!families.has(familyId)) families.set(familyId, new Set());
  families.get(familyId)!.add(ws);
}

function removeSocketFromFamily(familyId: string, ws: CustomWS) {
  const set = families.get(familyId);
  if (!set) return;
  set.delete(ws);
  if (set.size === 0) families.delete(familyId);
}

function sendToFamily(familyId: string, payload: any) {
  const sockets = families.get(familyId);
  if (!sockets) return;
  const data = JSON.stringify(payload);
  for (const ws of sockets) {
    if (ws.readyState === WS.OPEN) {
      ws.send(data);
    }
  }
}

function verifyTokenAndGetFamilyIds(token: string): string[] | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { families: string[] };
    if (!decoded.families || !Array.isArray(decoded.families)) return null;
    return decoded.families;
  } catch {
    return null;
  }
}

server.on('upgrade', (req, socket, head) => {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  const token = auth.split(' ')[1];
  const familyIds = verifyTokenAndGetFamilyIds(token);

  if (!familyIds) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  (req as any).familyIds = familyIds;
  wss.handleUpgrade(req, socket, head, (ws: CustomWS) => {
    ws.familyIds = familyIds;
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws: CustomWS, _req: any) => {
  const familyIds = ws.familyIds;

  console.log('Usuario conectado a familias:', familyIds);

  for (const famId of familyIds) {
    addSocketToFamily(famId, ws);
  }

  ws.send(JSON.stringify({ system: 'connected', families: familyIds }));

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (msg.toFamily && msg.message) {
      sendToFamily(msg.toFamily, {
        notification: 'Mensaje recibido',
        message: msg.message
      });
    }
  });

  ws.on('close', () => {
    for (const famId of familyIds) {
      removeSocketFromFamily(famId, ws);
    }
  });

  ws.on('error', () => {
    for (const famId of familyIds) {
      removeSocketFromFamily(famId, ws);
    }
  });
});

// Ejemplo: notificaciones automáticas
setInterval(() => {
  sendToFamily('fam1', { system: 'AutoMsg', message: 'Hola fam1 (cada 5s)' });
}, 5000);

setInterval(() => {
  sendToFamily('fam2', { system: 'AutoMsg', message: 'Hola fam2 (cada 7s)' });
}, 7000);

server.listen(8080, () => {
  console.log('Servidor WebSocket corriendo en puerto 8080');
});
