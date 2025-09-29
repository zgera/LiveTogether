import { Server } from "socket.io"
import { authenticationService } from "../services/authenticationService"
import http from "http"

export class webSocketService{
    private static io : Server

    static init(httpServer: http.Server){

        if (this.io) {
            return;
        }

        this.io = new Server(httpServer, {
            cors: {
                origin: "*",
            }
        })

        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token
            if (!token) {
                return next(new Error("Usuario no autenticado"))
            }
            try {
                const payload = authenticationService.validateToken(token);
                (socket as any).userId = payload.userId
            } catch (err) {
                next(new Error("Token invalido"))
            }
        })

        this.io.on("connection", (socket) => {
            const userId = (socket as any).userId
            console.log(`Usuario conectado: ${userId}`)

            socket.join(`user:${userId}`)

            socket.on("disconnect", () => {
                console.log(`Usuario desconectado: ${userId}`)
            })
        })
    }
}