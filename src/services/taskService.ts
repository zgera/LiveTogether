import { Task } from "@prisma/client";
import { FamilyUserRepository } from "../repositories/familyUserRepository";
import { TaskRepository } from "../repositories/taskRepository";
import { DifficultyRepository } from "../repositories/difficultyRepository";
import { TokenData } from "../types/auth";
import { AuthorizationService } from "./authorizationService";
import { FamilyService } from "./familyService";
import { notificationService } from "./notificationService";

enum Difficulty {
    facil = 1,
    media = 2,
    dificil = 3
}


export class TaskService {

    // Servicios
    protected familyService = new FamilyService();
    protected authorizationService = new AuthorizationService();
    protected NotificationService = new notificationService();

    async createTask(name: string, description: string, familyId: string, difficulty: number, deadline: Date, token: TokenData): Promise<Task> {
        if (!name || !description || !familyId || !difficulty || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (difficulty !== 1 && difficulty !== 2 && difficulty !== 3) {
            throw new Error("Dificultad inválida")
        }

        await this.authorizationService.assertUserInFamily(token, familyId)

        //deadline.setHours(23, 59, 59, 999);

        const task = await TaskRepository.createTask(name, description, familyId, token.userId, difficulty, deadline);
        return task;
    }

    async getTask(idTask: string): Promise<Task> {
        if (!idTask){
            throw new Error("El id de la tarea es obligatorio");
        }
        const task = await TaskRepository.getTask(idTask);
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

        const tasks = await TaskRepository.getTaskUnassigned(familyId);

        return tasks;
    }

    async getTasksAssignedUncompletedByUser(familyId: string, token: TokenData): Promise<Task[]> {
        if (!familyId || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.authorizationService.assertUserInFamily(token, familyId)

        const tasks = await TaskRepository.getTaskAssignedUncompletedByUser(familyId, token.userId);

        return tasks;
    }

    async getTasksUnderReviewByUser(familyId: string, token: TokenData): Promise<Task[]> {
        if (!familyId || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.authorizationService.assertUserInFamily(token, familyId)

        const tasks = await TaskRepository.getTaskUnderReviewByUser(familyId, token.userId);

        return tasks;
    }

    async getTasksAssignedUncompleted(familyId: string, token: TokenData): Promise<Task[]> {
        if (!familyId || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.authorizationService.assertUserIsAdmin(token, familyId)

        const tasks = await TaskRepository.getTaskAssignedUncompleted(familyId);

        return tasks;
    }

    async getTasksUnderReview(familyId: string, token: TokenData): Promise<Task[]> {
        if (!familyId || !token) {
            throw new Error("Todos los campos son obligatorios");
        }
        
        await this.authorizationService.assertUserIsAdmin(token, familyId)

        const tasks = await TaskRepository.getTasksUnderReview(familyId);
        
        return tasks;
    }
}

export class TaskCompletionService extends TaskService {

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

        if (taskAssigned.penalized === true) {
            throw new Error("La tarea ya ha perdido su validez por estar fuera de tiempo");
        }

        const taskCompleted = await TaskRepository.markTaskAsCompletedByUser(idTask);


        return taskCompleted;
    }

    private async getDifficultyPoints(difficultyId: number): Promise<number> {
        if (!difficultyId) {
            throw new Error("El id de dificultad es obligatorio");
        }

        const difficulty = await DifficultyRepository.getDifficultyById(difficultyId);

        if (!difficulty) {
            throw new Error("Dificultad no encontrada");
        }

        return difficulty.points;
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

        const taskCompleted = await TaskRepository.markTaskAsCompletedByAdmin(idTask);

        await this.consumeTaskPoints(taskCompleted);

        return taskCompleted;
    }
}

export class TaskAssignmentService extends TaskService {

    async externAssign(idTask: string, idUser: string): Promise<Task> {
        const task = await TaskRepository.assignTaskToUser(idTask, idUser)
        await this.NotificationService.createNotification(task.familyId, idUser, false, task.name, task.idTask)
        return task
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

        const taskAssigned = await TaskRepository.assignTaskToUser(idTask, token.userId);

        return taskAssigned;
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

        const taskUnassigned = await TaskRepository.unassignTaskFromUser(idTask)

        return taskUnassigned
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

        const taskAssigned = await this.externAssign(idTask, idUser)

        return taskAssigned;
    }

    extraTaskPerUser(user: {assigned: boolean, idFamilyUser: string, idUser: string, idFamily: string, idRole: number, points: number}, membersRound: {assigned: boolean, idFamilyUser: string, idUser: string, idFamily: string, idRole: number, points: number}[]): number{

        const userMVP = membersRound[membersRound.length - 1]

        if (user.idUser === userMVP.idUser){
            return 0
        }

        if (user.assigned === true){
            return 0
        }

        const extraTasks: number = 1
        const doubleUsersPoints: number = user.points * 2

        if (doubleUsersPoints < userMVP.points){
            user.assigned = true
            return extraTasks
        }
        return 0
    }

    async automaticallyAsignTasks(token: TokenData, idFamily: string){

        await this.familyService.getFamily(idFamily) //Verifica que exista la familia
        await this.authorizationService.assertUserIsAdmin(token, idFamily)

        const members = await FamilyUserRepository.getFamilyMembers(idFamily)
        const membersRound = members.map(member => ({
            ...member,
            assigned: false
            }));
        const tasks = await TaskRepository.getTaskUnassigned(idFamily)

        let index: number = 0

        while(tasks.length > 0){
            const user = membersRound[index]

            const taskCounter = 1 + this.extraTaskPerUser(user, membersRound)

            for(let i = 0; i < taskCounter; i++){
                const task = tasks.shift()
                
                if (!task){
                    break
                }

                await this.externAssign(task.idTask, user.idUser)
            }

            index = (index + 1) % members.length
        }
    }
}