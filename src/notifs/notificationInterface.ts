export abstract class NotificationService {
  abstract sendNotification(userId: string, message: string): Promise<void>;
}
