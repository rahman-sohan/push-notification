import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationProcessor {
	private readonly logger = new Logger(NotificationProcessor.name);

	constructor(private readonly notificationsService: NotificationsService) {
		this.logger.log('NotificationProcessor initialized');
	}

	@EventPattern('scheduled_notification')
	async handleScheduledNotification(data: { title: string; message: string; scheduleAt: string }) {
		console.log('Received scheduled notification data:', data);
		
		const { title, message, scheduleAt } = data;
		const scheduleTime = new Date(scheduleAt).getTime();
		const delay = scheduleTime - Date.now();

		if (delay > 0) {
			this.logger.log(`Notification scheduled in ${delay}ms`);
			setTimeout(async () => {
				await this.notificationsService.sendPushNotification(title, message);
				this.logger.log('Scheduled notification sent.');
			}, delay);
		} else {
			this.logger.warn('Invalid schedule time. Sending notification immediately.');
			await this.notificationsService.sendPushNotification(title, message);
		}
	}
}
