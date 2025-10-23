import { Task } from "@prisma/client";

import { taskWithCreatorAndUserAssigned, taskWithCreator } from "../types/taskTypes";

import { db } from "../db/db";

const now = new Date();

const startOfDay = new Date(now);
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date(now);
endOfDay.setHours(23, 59, 59, 999);

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

    static async getTask(idTask: string): Promise<Task | null>{
        return await db.task.findUnique({ where: { idTask } })
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
