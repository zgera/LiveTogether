import { Task } from "@prisma/client";

import { db } from "../db/db";

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

    async getTasksByFamily(familyId: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId } });
    }

    async getTaskUnassigned(familyId: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, assignedId: null } });
    }

    async getTaskAssignedUncompleted(familyId: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, assignedId: { not: null }, completedByUser: false } });
    }

    async getTasksUnderReview(familyId: string): Promise<Task[]>  {
        return await db.task.findMany({ where: { familyId, completedByUser: true, completedByAdmin: false } });
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
