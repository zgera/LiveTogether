import { Task } from "@prisma/client";

import { db } from "../db/db";

class TaskRepository {

    async createTask(name:string, description:string, familyId:string, creatorId:string, idDifficulty:string): Promise<Task>  {
        return await db.task.create({
            data: {
                name,
                description,
                completed: false,
                familyId,
                creatorId,
                //assignedId: null, 
                idDifficulty
            }})
    }

    async getTasksByFamily(familyId: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId } });
    }

    async getTasksIncompletedByFamily(familyId: string): Promise<Task[]>  {
        return await db.task.findMany({ where: { familyId, completed: false } });
    }

    async getTasksCompletedByFamily(familyId: string): Promise<Task[]>  {
        return await db.task.findMany({ where: { familyId, completed: true } });
    }

    async getTasksAssignedByFamilyUser(familyId: string, userId: string): Promise<Task[]>  {
        return await db.task.findMany({ where: { familyId, assignedId: userId } });
    }

    async getUnassignedTasks(familyId: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, assignedId: null } });
    }

    async markTaskAsComplete(idTask: string): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                completed: true
            }})
    }

    async markTaskAsUncomplete(idTask: string): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                completed: false
            }})
    }

    async assignTaskToUser(idTask: string, idUser: string): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                assignedId: idUser
            }})
    }

    async unassignTaskFromUser(idTask: string, idUser: string): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                assignedId: null
            }})
    }

    async changeTaskDifficulty(idTask: string, idDifficulty: string): Promise<Task> {
        return await db.task.update({
            where: { idTask },
            data: {
                idDifficulty
            }})
    }

    async getTasksByDifficulty(familyId: string, idDifficulty: string): Promise<Task[]> {
        return await db.task.findMany({ where: { familyId, idDifficulty } });
    }
    
    async deleteTask(idTask:string): Promise<Task> {
        
    }
}