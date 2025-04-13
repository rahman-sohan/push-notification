import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import initializeFirebaseAdmin from 'src/lib/firebase';
import { UsersService } from 'src/users/users.service';
const admin = initializeFirebaseAdmin();

@Injectable()
export class NotificationsService implements OnModuleInit  {
	constructor(private readonly usersServices: UsersService) {}
	private readonly logger = new Logger(NotificationsService.name);	
	onModuleInit() { this.usersServices.seedUsers(); }

	async sendPushNotification(title: string, message: string) {
		const tokens = await this.usersServices.getAllUsersDeviceTokens();	
		if (!tokens || tokens.length === 0) {
			this.logger.warn('No device tokens found for users.');
			return;
		}

		const payload = {
			notification: {
				title,
				body: message,
			},
			tokens,
		};

		try {
			await admin.messaging().sendEachForMulticast(payload);
			this.logger.log(`Push notification sent to ${tokens.length} users.`);
		} catch (error) {
			this.logger.error('Error sending push notification:', error);
		}
	}
}
