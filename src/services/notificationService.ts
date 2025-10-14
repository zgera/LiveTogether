import { Notification } from "@prisma/client"
import { TokenData } from "../types/auth"
import { notificationRepository } from "../repositories/notificationRepository"
import { FamilyUserRepository } from "../repositories/familyUserRepository";
import { webSocketService } from "../ws/webSocketService"


interface sendNotificationStrategy{
    send(idFamily: string, idUser: string, taskCreated: boolean, title: string, idTask: string): Promise<void>;
}

class sendNewTaskStrategy implements sendNotificationStrategy{
    async send(idFamily: string, idUser: string, taskCreated: boolean, title: string, idTask: string): Promise<void> {

        const familyMembers = await FamilyUserRepository.getFamilyMembers(idFamily)

        familyMembers.forEach(member => {
            notificationRepository.createNotification(idFamily, member.idUser, taskCreated, title, idTask)
        })

        webSocketService.emitFamilyMessage(idFamily, {type: "Notification", idFamily: `${idFamily}`})
    }
}

class sendAssignedTaskStrategy implements sendNotificationStrategy{
    async send(idFamily: string, idUser: string, taskCreated: boolean, title: string, idTask: string): Promise<void> {

        notificationRepository.createNotification(idFamily, idUser, taskCreated, title, idTask)

        webSocketService.emitPrivateMessage(idUser, {type: "Notification", idFamily: `${idFamily}`})
    }
}


export class notificationService{

    async createNotification(idFamily: string, idUser: string, taskCreated: boolean, title: string, idTask: string): Promise<void> {

        const strategy : sendNotificationStrategy = taskCreated ? new sendNewTaskStrategy() : new sendAssignedTaskStrategy()
        
        await strategy.send(idFamily, idUser, taskCreated, title, idTask)
    }

    async getNotifications(token: TokenData): Promise<Notification[]>{

        if(!token){
            throw new Error("El token es obligatorio");
        }

        const notifications = await notificationRepository.getNotificationsByUserId(token.userId);

        await notificationRepository.markNotificationsAsSeen(token.userId)

        return notifications;
    }

    async getUnseenNotificationsCount(token: TokenData): Promise<number>{
        if(!token){
            throw new Error("El token es obligatorio");
        }

        const count = await notificationRepository.getUnseenNotificationsCount(token.userId);
        
        return count;
    }
}   