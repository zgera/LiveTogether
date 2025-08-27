import { Task } from "@prisma/client";

import { db } from "../db/db";

const now = new Date();

const startOfDay = new Date(now);
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date(now);
endOfDay.setHours(23, 59, 59, 999);

export class TaskRepository {

    async createTask(name:string, description:string, familyId:string, creatorId:string, idDifficulty:number): Promise<Task>  {
    
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

    async getTask(idTask: string): Promise<Task | null>{
        return await db.task.findUnique({ where: { idTask } })
    }

    async getTaskUnassigned(familyId: string): Promise<Task[]> {
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


    async getTaskAssignedUncompletedByUser(familyId: string, userId: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, assignedId: userId, completedByUser: false } });
    }

    async getTaskUnderReviewByUser(familyId: string, userId: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, assignedId: userId, completedByUser: true, completedByAdmin: false } });
    }

    async getTaskAssignedUncompleted(familyId: string): Promise<Task[]> {
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

    async getTasksUnderReview(familyId: string): Promise<Task[]>  {
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

    async getTaskCompletedByAdmin(familyId: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, completedByUser: true } });
    }

    async getTasksCompletedByFamily(familyId: string): Promise<Task[]>  {
        return await db.task.findMany({ where: { familyId, completedByAdmin: true } });
    }

    async getTasksAssignedByFamilyUser(familyId: string, userId: string): Promise<Task[]>  {
        return await db.task.findMany({ where: { familyId, assignedId: userId } });
    }

    async getUnassignedTasks(familyId: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, assignedId: null } });
    }

    async markTaskAsCompletedByUser(idTask: string): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                completedByUser: true
            }})
    }

    async markTaskAsUncomplete(idTask: string): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                completedByUser: false
            }})
    }

    async markTaskAsCompletedByAdmin(idTask: string): Promise<Task> {
        return await db.task.update({
            where: {idTask},
            data: {
                completedByAdmin: true
            }
        })
    }

    async assignTaskToUser(idTask: string, idUser: string): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                assignedId: idUser
            }})
    }

    async unassignTaskFromUser(idTask: string): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                assignedId: null
            }})
    }

    async changeTaskDifficulty(idTask: string, idDifficulty: number): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                idDifficulty
            }})
    }

    async getTasksByDifficulty(familyId: string, idDifficulty: number): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, idDifficulty } });
    }
    
    async deleteTask(idTask:string): Promise<Task> {
        return await db.task.delete({ where: { idTask } })
    }
}
