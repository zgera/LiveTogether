import { Request, Response, NextFunction } from "express"
import { authenticationService } from "../services/authenticationService";
import { TokenData } from "../types/auth";

// Extiende la interfaz Request para incluir 'usuario'
declare global {
  namespace Express {
    interface Request {
      user?: TokenData;
    }
  }
}

export function autenticarToken(req: Request, res: Response, next: NextFunction) {
    //const authHeader = req.headers["authorization"];
    //const token = authHeader && authHeader.split(" ")[1];
    const token = req.cookies.access_token

    if (!token) {
        res.status(401).json({ mensaje: "No autenticado" });
        return
    }

    try {
        const decoded = authenticationService.validateToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ mensaje: "Token inválido o expirado" });
    }
}