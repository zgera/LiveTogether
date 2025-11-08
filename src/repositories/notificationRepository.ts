import { Notification } from "@prisma/client";
import { NotificationType } from "@prisma/client";

import { db } from "../db/db";

export class notificationRepository {
    static async createNotification(idFamily: string, idUser: string, type: NotificationType, title: string, idTask: string): Promise<Notification>{
        const notification = await db.notification.create({
            data: {
                idFamily,
                idUser,
                type,
                title,
                idTask
            }
        })
        return notification
    }

    static async getNotificationsByFamilyID(idUser: string, idFamily: string): Promise<Notification[]>{
        const notifications = await db.notification.findMany({
            where: {
                idUser,
                idFamily
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return notifications
    }

    static async getUnseenNotificationsCountByFamilyID(idUser: string, idFamily: string): Promise<number>{
        const notifications = await db.notification.count({
            where: {
                idUser,
                idFamily,
                seen: false
            }
        })
        return notifications
    }

    static async markNotificationsAsSeenByFamilyID(idUser: string, idFamily: string): Promise<void>{
        await db.notification.updateMany({
            where: {
                idUser,
                idFamily,
                seen: false
            },
            data: {
                seen: true
            }
        })
    }
}