import { Task } from "@prisma/client";
import { TaskRepository } from "../repositories/taskRepository";
import { TokenData } from "./tokenData";
import { AuthorizationService } from "./authorizationService";

enum Difficulty {
    facil = 1,
    media = 2,
    dificil = 3
}


export class TaskService {
    
    private authorizationService = new AuthorizationService();
    private repository = new TaskRepository();


    async createTask(name: string, description: string, familyId: string, difficulty: string, token: TokenData): Promise<Task> {
        if (!name || !description || !familyId || !difficulty || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (difficulty !== "facil" && difficulty !== "media" && difficulty !== "dificil") {
            throw new Error("Dificultad inválida")
        }

        if (!await this.authorizationService.isInFamily(token, familyId)){
            throw new Error ("El usuario no pertenece a la familia")
        }

        try {
            const task = await this.repository.createTask(name, description, familyId, token.userId, Difficulty[difficulty as keyof typeof Difficulty]);
            return task;
        } catch (err: any) {
            throw new Error("Ocurrió un error al crear la tarea. Intente más tarde");
        }
    }

    async autoAssignTask(idTask: string, token: TokenData): Promise<Task> {
        if (!idTask || !token){
            throw new Error("Todos los campos son obligatorios")
        }

        const taskUnassigned = await this.repository.getTask(idTask)

        if (!taskUnassigned){
            throw new Error ("Tarea inexistente")
        }

        if (taskUnassigned.assignedId !== null) {
            throw new Error("La tarea ya está asignada a otro usuario");
        }

        if (!await this.authorizationService.isInFamily(token, taskUnassigned.familyId)){
            throw new Error ("El usuario no pertenece a la familia de la tarea")
        }

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

        const taskAssigned = await this.repository.getTask(idTask)

        if (!taskAssigned){
            throw new Error ("Tarea inexistente")
        }

        if (taskAssigned.assignedId === null) {
            throw new Error("La tarea no está asignada a ningún usuario");
        }

        if (!await this.authorizationService.isAdmin(token, taskAssigned.familyId)){
            throw new Error ("El usuario debe ser admin para realizar esta tarea")
        }

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

        const taskAssigned = await this.repository.getTask(idTask);

        if (!taskAssigned) {
            throw new Error("Tarea inexistente");
        }

        if (!await this.authorizationService.isInFamily(token, taskAssigned.familyId)) {
            throw new Error("El usuario no pertenece a la familia de la tarea");
        }

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

    async completeTaskAsAdmin(idTask: string, token: TokenData): Promise<Task> {
        if (!idTask || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        const taskAssigned = await this.repository.getTask(idTask);

        if (!taskAssigned) {
            throw new Error("Tarea inexistente");
        }

        if (!await this.authorizationService.isAdmin(token, taskAssigned.familyId)) {
            throw new Error("El usuario debe ser admin para realizar esta tarea");
        }

        if (taskAssigned.completedByAdmin) {
            throw new Error("La tarea ya ha sido completada por el administrador");
        }

        try {
            const taskCompleted = await this.repository.markTaskAsCompletedByAdmin(idTask);
            return taskCompleted;
        } catch (err: any) {
            throw new Error("Ocurrió un error al completar la tarea. Intente más tarde");
        }
    }

    async assingTaskToUser(idTask: string, idUser: string, token: TokenData): Promise<Task> {
        if (!idTask || !idUser || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        const taskUnassigned = await this.repository.getTask(idTask);

        if (!taskUnassigned) {
            throw new Error("Tarea inexistente");
        }

        if (taskUnassigned.assignedId !== null) {
            throw new Error("La tarea ya está asignada a otro usuario");
        }

        if (!await this.authorizationService.isAdmin(token, taskUnassigned.familyId)) {
            throw new Error("El usuario debe ser admin para realizar esta tarea");
        }

        try {
            const taskAssigned = await this.repository.assignTaskToUser(idTask, idUser);
            return taskAssigned;
        } catch (err: any) {
            throw new Error("Ocurrió un error al asignar la tarea. Intente más tarde");
        }
    }

}