import { Notification } from "@prisma/client"
import { TokenData } from "../types/auth"
import { notificationRepository } from "../repositories/notificationRepository"
import { FamilyUserRepository } from "../repositories/familyUserRepository";
import { webSocketService } from "../ws/webSocketService"
import { NotificationType } from "@prisma/client";

enum NotificationTypesTitle {
    TASK_CREATED = "Nueva tarea creada",
    TASK_ASSIGNED = "Tarea asignada",
    TASK_EXPIRE_SOON = "Tarea próxima a vencer",
    TASK_EXPIRED = "Tarea vencida"
}


interface createNotificationStrategy{
    send(idFamily: string, idUser: string, type: NotificationType, title: string, idTask: string): Promise<void>;
}

class createNewTaskStrategy implements createNotificationStrategy{
    async send(idFamily: string, idUser: string, type: NotificationType, title: string, idTask: string): Promise<void> {

        const familyMembers = await FamilyUserRepository.getFamilyMembers(idFamily)

        familyMembers.forEach(member => {
            notificationRepository.createNotification(idFamily, member.idUser, type, title, idTask)
        })

        webSocketService.emitFamilyMessage(idFamily, {type: "Notification", idFamily: `${idFamily}`})
    }
}

class createAssignedTaskStrategy implements createNotificationStrategy{
    async send(idFamily: string, idUser: string, type: NotificationType, title: string, idTask: string): Promise<void> {

        notificationRepository.createNotification(idFamily, idUser, type, title, idTask)

        webSocketService.emitPrivateMessage(idUser, {type: "Notification", idFamily: `${idFamily}`})
    }
}

class createExpireSoonTaskStrategy implements createNotificationStrategy{
    async send(idFamily: string, idUser: string, type: NotificationType, title: string, idTask: string): Promise<void> {
        notificationRepository.createNotification(idFamily, idUser, type, title, idTask)
        webSocketService.emitPrivateMessage(idUser, {type: "Notification", idFamily: `${idFamily}`})
    }
}

class createExpiredTaskStrategy implements createNotificationStrategy{
    async send(idFamily: string, idUser: string, type: NotificationType, title: string, idTask: string): Promise<void> {
        notificationRepository.createNotification(idFamily, idUser, type, title, idTask)
        webSocketService.emitPrivateMessage(idUser, {type: "Notification", idFamily: `${idFamily}`})
    }
}

export class notificationService{

    private pickStrategy(type: NotificationType): createNotificationStrategy {
        switch(type){
            case NotificationType.TASK_CREATED:
                return new createNewTaskStrategy();
            case NotificationType.TASK_ASSIGNED:
                return new createAssignedTaskStrategy();
            case NotificationType.TASK_EXPIRE_SOON:
                return new createExpireSoonTaskStrategy();
            case NotificationType.TASK_EXPIRED:
                return new createExpiredTaskStrategy();
            default:
                throw new Error("Tipo de notificación no soportado");
        }
    }

    async  createNotification(idFamily: string, idUser: string, type: NotificationType, idTask: string): Promise<void> {

        const strategy : createNotificationStrategy = this.pickStrategy(type);

        await strategy.send(idFamily, idUser, type, NotificationTypesTitle[type], idTask)
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