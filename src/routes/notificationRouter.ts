import { Router, Request, Response } from "express"

import { notificationService } from "../services/notificationService";

import { autenticarToken } from "../middleware/authMiddleware";

const NotificationService = new notificationService()

export const notificationRouter = Router()

/**
 * @route POST /notifications/get/:idFamily
 * @description Obtiene todas las notificaciones de una familia específica para el usuario autenticado.
 * @example
 * // Request
 * POST /notifications/get/1234
 *
 * // Response
 * {
 *   "notifications": [
 *     {
 *       "idFamily": "fam_1234",
 *       "idNotification": "notif_1",
 *       "idUser": "user_5678",
 *       "type": "TASK_ASSIGNED",
 *       "title": "Se te asignó una nueva tarea",
 *       "idTask": "task_789",
 *       "createdAt": "2025-11-08T14:23:45.000Z",
 *       "seen": false
 *     },
 *     {
 *       "idFamily": "fam_1234",
 *       "idNotification": "notif_2",
 *       "idUser": "user_5678",
 *       "type": "TASK_COMPLETED",
 *       "title": "Tarea revisada y verificada por el admin",
 *       "idTask": "task_456",
 *       "createdAt": "2025-11-07T10:15:00.000Z",
 *       "seen": true
 *     }
 *   ]
 * }
 * }
 */
notificationRouter.get("/get/:idFamily", autenticarToken, async(req: Request, res: Response) => {
    const idFamily = req.params.idFamily
    const token = req.user!

    try {
        const notifications = await NotificationService.getNotifications(token, idFamily)
        res.status(200).send({ notifications })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener invitaciones';
        res.status(401).send({ error: message });
    }
})


/**
 * @route POST /notifications/getUnseenCount
 * @description Obtiene el conteo de notificaciones no vistas por cada familia del usuario autenticado
 * @example
 * // Request
 * POST /notifications/getUnseenCount
 *
 * // Response
 * {
 *   "unseenCount": [
 *     { "idFamily": "1234", "count": 3 },
 *     { "idFamily": "5678", "count": 0 }
 *   ]
 * }
 */

notificationRouter.get("/getUnseenCount", autenticarToken, async(req: Request, res: Response) => {
    const token = req.user!

    try {
        const unseenCount = await NotificationService.getUnseenNotificationsCountPerFamily(token)
        res.status(200).send({ unseenCount })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener invitaciones';
        res.status(401).send({ error: message });
    }
})

