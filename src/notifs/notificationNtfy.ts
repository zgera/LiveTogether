import fetch from 'node-fetch';
import { NotificationService } from './notificationInterface';

export class NtfyNotificationService extends NotificationService {
  private baseUrl = 'https://ntfy.sh';

  constructor(private topic: string) {
    super();
  }

  async sendNotification(_userId: string, message: string): Promise<void> {
    const url = `${this.baseUrl}/${this.topic}`;

    const res = await fetch(url, {
      method: 'POST',
      body: message,
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to send notification: ${res.status} ${res.statusText}`);
    }

    console.log(`Notification sent to topic "${this.topic}"`);
  }
}
