import { Task } from "@prisma/client";
import { TaskRepository } from "../repositories/taskRepository";
import { TokenData } from "./tokenData";
import { FamilyUserRepository } from "../repositories/familyUserRepository";
import { isAdmin } from "./isAdmin";
export class TaskService {
    
    private repository = new TaskRepository();
    private familyUserRepository = new FamilyUserRepository();

    private async isInFamily(token: TokenData, familyId: string): Promise<boolean> {
        const members = await this.familyUserRepository.getFamilyMembers(familyId)
        const userInFamily = members.some(member => member.idUser === token.userId);
        return userInFamily;
    }

    async createTask(name: string, description: string, familyId: string, idDifficulty: string, token: TokenData): Promise<Task> {
        if (!name || !description || !familyId || !idDifficulty || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (!await this.isInFamily(token, familyId)){
            throw new Error ("El usuario no pertenece a la familia")
        }

        try {
            const task = await this.repository.createTask(name, description, familyId, token.userId, idDifficulty);
            return task;
        } catch (err: any) {
            throw new Error("Ocurrió un error al crear la tarea. Intente más tarde");
        }
    }

    async autoAssignedTask(idTask: string, token: TokenData): Promise<Task> {
        if (!idTask || !token){
            throw new Error("Todos los campos son obligatorios")
        }

        const taskUnassigned = await this.repository.getTask(idTask)

        if (!this.isInFamily(token, taskUnassigned.familyId)){
            throw new Error ("El usuario no pertenece a la familia de la tarea")
        }

        try {
            const taskAssigned = await this.repository.assignTaskToUser(idTask, token.userId);
            return taskAssigned;
        } catch (err: any){
            throw new Error("Ocurrio un error al asingar la tarea. Intente mas tarde")
        }
    }

    async UnassignedTask(idTask: string, token: TokenData): Promise<Task> {
        if (!idTask || !token){
            throw new Error("Todos los campos son obligatorios")
        }

        const taskAssigned = await this.repository.getTask(idTask)

        if (!this.isInFamily(token, taskAssigned.famililyId)){
            throw new Error ("El usuario no pertenece a la familia de la tarea")
        }

        if (!await isAdmin(token, taskAssigned.famililyId)){
            throw new Error ("El usuario debe ser admin para realizar esta tarea")
        }

        try {
            const taskUnassigned = await this.repository.unassignTaskFromUser(idTask)
            return taskUnassigned
        } catch (err: any){
            throw new Error("Ocurrio un error al realizar la operacion. Intente mas tarde")
        }
    }
}