import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../database/entities/users.entity';

@Injectable()
export class NotificationsService {
	private readonly logger = new Logger(NotificationsService.name);

	constructor(@InjectModel(User.name) private userModel: Model<User>) {
		if (!admin.apps.length) {
			admin.initializeApp({
				credential: admin.credential.applicationDefault(),
			});
		}
	}

	async sendPushNotification(title: string, message: string) {
		const users = await this.userModel.find().select('deviceToken');
		const tokens = users.map((user) => user.deviceToken);

		if (tokens.length === 0) {
			this.logger.warn('No users found to send notifications.');
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
			this.logger.log(
				`Push notification sent to ${tokens.length} users.`,
			);
		} catch (error) {
			this.logger.error('Error sending push notification:', error);
		}
	}
}
