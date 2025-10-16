import { Server } from "socket.io"
import { authenticationService } from "../services/authenticationService"
import { FamilyService } from "../services/familyService"
import http from "http"

const familyService = new FamilyService()

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
                (socket as any).user = payload
            } catch (err) {
                next(new Error("Token invalido"))
            }
        })

        this.io.on("connection", async (socket) => {
            const user = (socket as any).user
            console.log(`Usuario conectado: ${user.userId}`)

            socket.join(`user:${user.userId}`)

            const familiesIDs = await familyService.getFamiliesByUser(user)

            familiesIDs.forEach( family => {
                socket.join(`family:${family.idFamily}`)
            });

            socket.on("disconnect", () => {
                console.log(`Usuario desconectado: ${user.userId}`)
            })
        })
    }

    static getIO(){
        if (this.io === null){
            throw new Error("No se inicio el webSocket Server")
        }
        return this.io
    }

    static emitPrivateMessage(idUser: string, payload: Record<string, any>){
        this.getIO()
        this.io.to(`user:${idUser}`).emit("notification", payload);
    }

    static emitFamilyMessage(idFamily: string, payload: Record<string, any>){
        this.getIO()
        this.io.to(`family:${idFamily}`).emit("notification", payload);
    }
}