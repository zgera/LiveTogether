import { Task } from "@prisma/client";

import { db } from "../db/db";

const now = new Date();

const startOfDay = new Date(now);
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date(now);
endOfDay.setHours(23, 59, 59, 999);

export class TaskRepository {

    static async createTask(name:string, description:string, familyId:string, creatorId:string, idDifficulty:number): Promise<Task>  {
    
        return await db.task.create({
            data: {
                name,
                description,
                completedByUser: false,
                completedByAdmin: false,
                familyId,
                creatorId,
                idDifficulty
            }})
    }   

    static async getTask(idTask: string): Promise<Task | null>{
        return await db.task.findUnique({ where: { idTask } })
    }

    static async getTaskUnassigned(familyId: string): Promise<Task[]> {
        return await db.task.findMany({
            where: {
                familyId,
                assignedId: null
            },
            orderBy: {
                idDifficulty: 'desc'
            }
        });
    }


    static async getTaskAssignedUncompletedByUser(familyId: string, userId: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, assignedId: userId, completedByUser: false } });
    }

    static async getTaskUnderReviewByUser(familyId: string, userId: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, assignedId: userId, completedByUser: true, completedByAdmin: false } });
    }

    static async getTaskAssignedUncompleted(familyId: string): Promise<Task[]> {
        return await db.task.findMany({ 
            where: { 
                familyId,
                assignedId: { not: null }, 
                completedByUser: false,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });
    }

    static async getTasksUnderReview(familyId: string): Promise<Task[]>  {
        return await db.task.findMany({ 
            where: { 
                familyId, 
                completedByUser: true, 
                completedByAdmin: false,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            } 
        });
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
