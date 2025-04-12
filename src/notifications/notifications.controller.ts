import { Controller, Post, Body, Inject } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller('push')
export class NotificationsController {
	constructor(
		private readonly notificationService: NotificationsService,
		@Inject('NOTIFICATION_QUEUE') private notificationQueue: ClientProxy,
	) {}

	@Post('send-now')
	async sendNow(@Body() body: { title: string; message: string }) {
		const { title, message } = body;
		await this.notificationService.sendPushNotification(title, message);
		return { success: true, message: 'Notification sent immediately' };
	}

	@Post('schedule')
	async schedule(
		@Body() body: { title: string; message: string; scheduleAt: string },
	) {
		const { title, message, scheduleAt } = body;
		const scheduleDate = new Date(scheduleAt).getTime();

		if (scheduleDate < Date.now()) {
			return {
				success: false,
				message: 'Schedule time must be in the future',
			};
		}

		this.notificationQueue.emit('schedule_notification', {
			title,
			message,
			scheduleAt,
		});

		return {
			success: true,
			message: `Notification scheduled for ${scheduleAt}`,
		};
	}
}
