import { Task } from "@prisma/client";

import { taskWithCreatorAndUserAssigned, taskWithCreator } from "../types/taskTypes";

import { db } from "../db/db";

export class TaskRepository {

    static async createTask(name:string, description:string, familyId:string, creatorId:string, idDifficulty:number, deadline: Date): Promise<Task>  {
        return await db.task.create({
            data: {
                name,
                description,
                completedByUser: false,
                completedByAdmin: false,
                familyId,
                creatorId,
                idDifficulty,
                deadline
            }})
    }

    static async getTaskCountCompletedTodayByUser(familyId: string, userId: string, startOfDay: Date, endOfDay: Date): Promise<number> {
        return await db.task.count({
            where: {
                familyId,
                assignedId: userId,
                completedByAdmin: true,
                deadline: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });
    }

    static async getTaskCountTodayByUser(familyId: string, userId: string, startOfDay: Date, endOfDay: Date): Promise<number> {
        return await db.task.count({
            where: {
                familyId,
                assignedId: userId,
                deadline: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });
    }

    static async getTaskCountTodayByFamily(familyId: string, startOfDay: Date, endOfDay: Date): Promise<number> {
        return await db.task.count({
            where: {
                familyId,
                deadline: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });
    }

    static async getTaskCountCompletedTodayByFamily(familyId: string, startOfDay: Date, endOfDay: Date): Promise<number> {
        return await db.task.count({
            where: {
                familyId,
                completedByAdmin: true,
                deadline: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });
    }

    static async getUserHistoryTasks(familyId: string, userId: string): Promise<Task[]> {
        return await db.task.findMany({ 
            where: 
                { 
                    familyId,
                    assignedId: userId,
                    OR: [
                        { completedByAdmin: true },
                        { penalized: true }
                    ]
                },
            orderBy: { deadline: 'desc' }
        });
    }

    // GET /api/task/getTask/:idTask
    // 📘 Descripción:
    // Obtiene una tarea específica por su ID. 
    // Devuelve la información completa de la tarea, incluyendo:
    // - Datos del creador (`creator`)
    // - Datos del usuario asignado (`assignedTo`)
    // - Dificultad asociada (`difficulty`)
    //
    // Requiere autenticación mediante token.
    //
    // 🧩 Parámetros de ruta:
    // :idTask — ID único de la tarea a obtener.
    //
    // 🧩 Ejemplo de request:
    // GET /api/task/getTask/clzb4x12f0000abc123xyz
    //
    // ✅ Ejemplo de response (200 OK):
    // {
    //   "task": {
    //     "idTask": "clzb4x12f0000abc123xyz",
    //     "name": "Lavar los platos",
    //     "description": "Lavar todos los platos del almuerzo",
    //     "completedByUser": false,
    //     "completedByAdmin": false,
    //     "familyId": "clzb3wq5d0001abc123xyz",
    //     "creatorId": "clzb2vr9e0002abc123xyz",
    //     "assignedId": "clzb2zj9f0003abc123xyz",
    //     "idDifficulty": 2,
    //     "createdAt": "2025-11-03T14:32:45.123Z",
    //     "deadline": "2025-11-04T18:00:00.000Z",
    //     "penalized": false,
    //     "notifiedDeadlineSoon": false,
    //
    //     "creator": {
    //       "idUser": "clzb2vr9e0002abc123xyz",
    //       "username": "valen123",
    //       "firstName": "Valentín",
    //       "lastName": "Gerakios"
    //     },
    //     "assignedTo": {
    //       "idUser": "clzb2zj9f0003abc123xyz",
    //       "username": "martina",
    //       "firstName": "Martina",
    //       "lastName": "Pérez"
    //     },
    //     "difficulty": {
    //       "idDifficulty": 2,
    //       "name": "Media",
    //       "points": 20
    //     }
    //   }
    // }
    //
    static async getTask(idTask: string): Promise<Task | null>{
        return await db.task.findUnique(
            { where: {
                idTask 
            }, include: {
                creator: {
                    select: {
                        idUser: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                },
                assignedTo: {
                    select: {
                        idUser: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                },
                difficulty: {
                    select:{
                        idDifficulty: true,
                        name: true,
                        points: true
                    }
                }
            }
            }
        )
    }

    static async getTaskUnassigned(familyId: string): Promise<taskWithCreator[]> {
        return await db.task.findMany({
            where: {
                familyId,
                assignedId: null
            },
            orderBy: {
                idDifficulty: 'desc'
            },
            include: {
                creator: {
                    select: {
                        idUser: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                },
                difficulty: {
                    select: {
                        idDifficulty: true,
                        name: true,
                        points: true
                    }
                }
            }
        });
    }


    static async getTaskAssignedUncompletedByUser(familyId: string, userId: string): Promise<taskWithCreator[]> {
        return await db.task.findMany({ 
            where: { 
                familyId, 
                assignedId: userId, 
                completedByUser: false, 
                penalized: false 
            },
            include: {
                creator: {
                    select: {
                        idUser: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                },
                assignedTo: {
                    select: {
                        idUser: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                },
                difficulty: {
                    select: {
                        idDifficulty: true,
                        name: true,
                        points: true
                    }
                }
            }
        });
    }

    static async getTaskUnderReviewByUser(familyId: string, userId: string): Promise<taskWithCreator[]> {
        return await db.task.findMany({ 
            where: { 
                familyId, 
                assignedId: userId, 
                completedByUser: true, 
                completedByAdmin: false 
            },
            include: {
                creator: {
                    select: {
                        idUser: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                },
                difficulty: {
                    select: {
                        idDifficulty: true,
                        name: true,
                        points: true
                    }
                }
            }
        });
    }

    static async getTaskAssignedUncompleted(familyId: string): Promise<taskWithCreatorAndUserAssigned[]> {
        const tasks = await db.task.findMany({ 
            where: { 
                familyId,
                assignedId: { not: null }, 
                completedByUser: false,
                penalized: false
            },
            include: {
                assignedTo: {
                    select: {
                        idUser: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                },
                creator: {
                    select: {
                        idUser: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                },
                difficulty: {
                    select: {
                        idDifficulty: true,
                        name: true,
                        points: true
                    }
                }
            }
        });
        return tasks
    }

    static async getTasksUnderReview(familyId: string): Promise<taskWithCreatorAndUserAssigned[]>  {
        const tasks = await db.task.findMany({ 
            where: { 
                familyId, 
                completedByUser: true, 
                completedByAdmin: false,
            },
            include: {
                assignedTo: {
                    select: {
                        idUser: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                },
                creator: {
                    select: {
                        idUser: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                },
                difficulty: {
                    select: {
                        idDifficulty: true,
                        name: true,
                        points: true
                    }
                }
            }
        });
        return tasks
    }

    static async getTaskCompletedByAdmin(familyId: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, completedByUser: true } });
    }

    static async getTasksCompletedByFamily(familyId: string): Promise<Task[]>  {
        return await db.task.findMany({ where: { familyId, completedByAdmin: true } });
    }

    static async getTasksAssignedByFamilyUser(familyId: string, userId: string): Promise<Task[]>  {
        return await db.task.findMany({ where: { familyId, assignedId: userId } });
    }

    static async getUnassignedTasks(familyId: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, assignedId: null } });
    }

    static async findExpiredUnpenalized(now: Date) {
        return db.task.findMany({
            where: {
                assignedId: { not: null },          // solo tareas asignadas
                completedByUser: false,             // el usuario NO la completó
                penalized: false,                   // aún no penalizada
                deadline: {lte: now}
            },
            include: {
                difficulty: true,
            },
        });
    }

    static async findDueSoon(notifiedBefore: Date, now: Date) {
        return db.task.findMany({
            where: {
                assignedId: { not: null },
                completedByUser: false,
                notifiedDeadlineSoon: false,
                deadline: {
                gte: now,
                lte: notifiedBefore,
                },
            },
            include: {
                assignedTo: true,
            }
        });
    }

    static async markPenalized(idTask: string) {
        return db.task.update({
            where: { idTask },
            data: { penalized: true }
        });
    }

    static async markNotified(idTask: string) {
        return db.task.update({
            where: { idTask },
            data: { notifiedDeadlineSoon: true }
        });
    }

    static async markTaskAsCompletedByUser(idTask: string): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                completedByUser: true
            }})
    }

    static async markTaskAsUncomplete(idTask: string): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                completedByUser: false
            }})
    }

    static async markTaskAsCompletedByAdmin(idTask: string): Promise<Task> {
        return await db.task.update({
            where: {idTask},
            data: {
                completedByAdmin: true
            }
        })
    }

    static async markTaskAsUncompletedByUser(idTask: string): Promise<Task> {
        return await db.task.update({
            where: {idTask},
            data: {
                completedByUser: false
            }
        })
    }

    static async assignTaskToUser(idTask: string, idUser: string): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                assignedId: idUser
            }})
    }

    static async unassignTaskFromUser(idTask: string): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                assignedId: null
            }})
    }

    static async changeTaskDifficulty(idTask: string, idDifficulty: number): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                idDifficulty
            }})
    }

    static async getTasksByDifficulty(familyId: string, idDifficulty: number): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, idDifficulty } });
    }
    
    static async deleteTask(idTask:string): Promise<Task> {
        return await db.task.delete({ where: { idTask } })
    }
}
