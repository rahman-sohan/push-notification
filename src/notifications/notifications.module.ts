import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { UsersModule } from 'src/users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationProcessor } from './notifications.processor';
@Module({
	imports: [
		UsersModule,
		ClientsModule.register([
			{
				name: 'NOTIFICATION_QUEUE',
				transport: Transport.RMQ,
				options: {
					urls: ['amqp://localhost:5672'],
					queue: 'notification_queue',
					queueOptions: { durable: true },
				},
			},
		]),
	],
	controllers: [NotificationsController],
	providers: [NotificationsService, NotificationProcessor]
})
export class NotificationsModule {}
