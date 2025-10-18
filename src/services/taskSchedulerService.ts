import cron from "node-cron";
import { TaskRepository } from "../repositories/taskRepository";
import { FamilyUserRepository } from "../repositories/familyUserRepository";
import { notificationService } from "./notificationService";
import { NotificationType } from "@prisma/client";

class TaskSchedulerService {

  private NotificationService = new notificationService();

  constructor() {
    // Cron cada 10 minutos: procesar tareas vencidas
    cron.schedule("*/10 * * * *", async () => {
      await this.processExpiredTasks();
    });

    // Cron cada 30 minutos: notificar tareas próximas a vencer
    cron.schedule("*/30 * * * *", async () => {
      await this.processSoonToExpireTasks();
    });
  }

  async processExpiredTasks() {
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    const expiredTasks = await TaskRepository.findExpiredUnpenalized(tenMinutesAgo, now);

    for (const task of expiredTasks) {
        // Restar puntos al usuario asignado
        await FamilyUserRepository.subtractPointsFromMemberInFamily(task.familyId, task.assignedId!, task.difficulty.points);

        // Marcar como penalizada
        await TaskRepository.markPenalized(task.idTask);

        await this.NotificationService.createNotification(task.familyId, task.assignedId!, NotificationType.TASK_EXPIRED, task.idTask);

        console.log(`[Penalización] ${task.name} vencida, puntos descontados`);
    }
  }

  async processSoonToExpireTasks() {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const soonTasks = await TaskRepository.findDueSoon(twoHoursLater, now);

    for (const task of soonTasks) {
        await TaskRepository.markNotified(task.idTask);

        await this.NotificationService.createNotification(task.familyId, task.assignedId!, NotificationType.TASK_EXPIRE_SOON, task.idTask);

        console.log(`[Notificación] ${task.name} vence pronto`);
    }
  }
}

export const taskSchedulerService = new TaskSchedulerService();
