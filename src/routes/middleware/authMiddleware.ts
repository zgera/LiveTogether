import { Request, Response, NextFunction } from "express"
import { authService } from "../../services/authService";

// Extiende la interfaz Request para incluir 'usuario'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function autenticarToken(req: Request, res: Response, next: NextFunction){
    const token = req.cookies.token

    if (!token){
        res.status(401).json({mensaje: "No autenticado"})
        return
    }

    try {
        const decoded = authService.validateToken(token)
        req.user = decoded
        next()
    } catch (error) {
        res.status(403).json({ mensaje: 'Token invalido o expirado' })
    }
}