import { Task } from "@prisma/client";
import { TaskRepository } from "../repositories/taskRepository";
import { DifficultyRepository } from "../repositories/difficultyRepository";
import { TokenData } from "../types/auth";
import { AuthorizationService } from "./authorizationService";
import { FamilyService } from "./familyService";

enum Difficulty {
    facil = 1,
    media = 2,
    dificil = 3
}


export class TaskService {
    
    // Repositorio
    private repository = new TaskRepository();
    private difficultyRepository = new DifficultyRepository();

    // Servicios
    private familyService = new FamilyService();
    private authorizationService = new AuthorizationService();

    async createTask(name: string, description: string, familyId: string, difficulty: number, token: TokenData): Promise<Task> {
        if (!name || !description || !familyId || !difficulty || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (difficulty !== 1 && difficulty !== 2 && difficulty !== 3) {
            throw new Error("Dificultad inválida")
        }

        await this.authorizationService.assertUserInFamily(token, familyId)

        try {
            const task = await this.repository.createTask(name, description, familyId, token.userId, difficulty);
            return task;
        } catch (err: any) {
            throw new Error("Ocurrió un error al crear la tarea. Intente más tarde");
        }
    }

    async getTask(idTask: string): Promise<Task> {
        if (!idTask){
            throw new Error("El id de la tarea es obligatorio");
        }
        const task = await this.repository.getTask(idTask);
        if (!task) {
            throw new Error("Tarea inexistente");
        }
        return task
    }

    async getTasksUnassigned(familyId: string, token: TokenData): Promise<Task[]> {
        if (!familyId || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.authorizationService.assertUserInFamily(token, familyId)

        try {
            const tasks = await this.repository.getTaskUnassigned(familyId);
            return tasks;
        } catch (err: any) {
            throw new Error("Ocurrió un error al obtener las tareas. Intente más tarde");
        }
    }

    async getTasksAssignedUncompletedByUser(familyId: string, token: TokenData): Promise<Task[]> {
        if (!familyId || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.authorizationService.assertUserInFamily(token, familyId)

        try {
            const tasks = await this.repository.getTaskAssignedUncompletedByUser(familyId, token.userId);
            return tasks;
        } catch (err: any) {
            throw new Error("Ocurrió un error al obtener las tareas. Intente más tarde");
        }
    }

    async getTasksUnderReviewByUser(familyId: string, token: TokenData): Promise<Task[]> {
        if (!familyId || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.authorizationService.assertUserInFamily(token, familyId)

        try {
            const tasks = await this.repository.getTaskUnderReviewByUser(familyId, token.userId);
            return tasks;
        } catch (err: any) {
            throw new Error("Ocurrió un error al obtener las tareas. Intente más tarde");
        }
    }

    async getTasksAssignedUncompleted(familyId: string, token: TokenData): Promise<Task[]> {
        if (!familyId || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.authorizationService.assertUserIsAdmin(token, familyId)

        try {
            const tasks = await this.repository.getTaskAssignedUncompleted(familyId);
            return tasks;
        } catch (err: any) {
            throw new Error("Ocurrió un error al obtener las tareas. Intente más tarde");
        }
    }

    async getTasksUnderReview(familyId: string, token: TokenData): Promise<Task[]> {
        if (!familyId || !token) {
            throw new Error("Todos los campos son obligatorios");
        }
        
        await this.authorizationService.assertUserIsAdmin(token, familyId)

        try {
            const tasks = await this.repository.getTasksUnderReview(familyId);
            return tasks;
        } catch (err: any) {
            throw new Error("Ocurrió un error al obtener las tareas. Intente más tarde");
        }
    }

    async autoAssignTask(idTask: string, token: TokenData): Promise<Task> {
        if (!idTask || !token){
            throw new Error("Todos los campos son obligatorios")
        }

        const taskUnassigned = await this.getTask(idTask);

        if (taskUnassigned.assignedId !== null) {
            throw new Error("La tarea ya está asignada a otro usuario");
        }

        await this.authorizationService.assertUserInFamily(token, taskUnassigned.familyId)

        try {
            const taskAssigned = await this.repository.assignTaskToUser(idTask, token.userId);
            return taskAssigned;
        } catch (err: any){
            throw new Error("Ocurrio un error al asingar la tarea. Intente mas tarde")
        }
    }

    async unassignTask(idTask: string, token: TokenData): Promise<Task> {
        if (!idTask || !token){
            throw new Error("Todos los campos son obligatorios")
        }

        const taskAssigned = await this.getTask(idTask)

        if (taskAssigned.assignedId === null) {
            throw new Error("La tarea no está asignada a ningún usuario");
        }

        await this.authorizationService.assertUserIsAdmin(token, taskAssigned.familyId)

        try {
            const taskUnassigned = await this.repository.unassignTaskFromUser(idTask)
            return taskUnassigned
        } catch (err: any){
            throw new Error("Ocurrio un error al realizar la operacion. Intente mas tarde")
        }
    }

    async completeTaskAsUser(idTask: string, token: TokenData): Promise<Task> {
        if (!idTask || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        const taskAssigned = await this.getTask(idTask);

        await this.authorizationService.assertUserInFamily(token, taskAssigned.familyId)

        if (taskAssigned.assignedId !== token.userId) {
            throw new Error("El usuario no es el encargado de la tarea");
        }

        if (taskAssigned.completedByUser) {
            throw new Error("La tarea ya ha sido completada por el usuario");
        }

        try {
            const taskCompleted = await this.repository.markTaskAsCompletedByUser(idTask);
            return taskCompleted;
        } catch (err: any) {
            throw new Error("Ocurrió un error al completar la tarea. Intente más tarde");
        }
    }

    private async getDifficultyPoints(difficultyId: number): Promise<number> {
        if (!difficultyId) {
            throw new Error("El id de dificultad es obligatorio");
        }
        try {
            const difficulty = await this.difficultyRepository.getDifficultyById(difficultyId);
            if (!difficulty) {
                throw new Error("Dificultad no encontrada");
            }
            return difficulty.points;
        } catch (err: any) {
            throw new Error("Ocurrió un error al obtener la dificultad. Intente más tarde");
        }
    }

    private async consumeTaskPoints(task: Task): Promise<void> {
        const difficultyPoints = await this.getDifficultyPoints(task.idDifficulty);
        if (task.assignedId === null) {
            throw new Error("La tarea no está asignada a ningún usuario");
        }
        await this.familyService.addPointsToMemberInFamily(task.familyId, task.assignedId, difficultyPoints);
    }

    async completeTaskAsAdmin(idTask: string, token: TokenData): Promise<Task> {
        if (!idTask || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        const taskAssigned = await this.getTask(idTask);

        await this.authorizationService.assertUserIsAdmin(token, taskAssigned.familyId)

        if (taskAssigned.completedByAdmin) {
            throw new Error("La tarea ya ha sido completada por el administrador");
        }

        try {
            const taskCompleted = await this.repository.markTaskAsCompletedByAdmin(idTask);
            await this.consumeTaskPoints(taskCompleted);
            return taskCompleted;
        } catch (err: any) {
            throw new Error("Ocurrió un error al completar la tarea. Intente más tarde");
        }
    }

    async assingTaskToUser(idTask: string, idUser: string, token: TokenData): Promise<Task> {
        if (!idTask || !idUser || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        const taskUnassigned = await this.getTask(idTask);

        if (taskUnassigned.assignedId !== null) {
            throw new Error("La tarea ya está asignada a otro usuario");
        }

        await this.authorizationService.assertUserIsAdmin(token, taskUnassigned.familyId)

        try {
            const taskAssigned = await this.repository.assignTaskToUser(idTask, idUser);
            return taskAssigned;
        } catch (err: any) {
            throw new Error("Ocurrió un error al asignar la tarea. Intente más tarde");
        }
    }

    async automaticallyAsignTasks(token: TokenData, idFamily: string){

        await this.familyService.getFamily(idFamily) //Verifica que exista la familia
        await this.authorizationService.assertUserIsAdmin(token, idFamily)

        const members = await this.familyService.getFamilyMembers(idFamily)
        const tasks = await this.repository.getTaskUnassigned(idFamily)
    }

}