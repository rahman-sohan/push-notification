import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DatabaseModule } from './database/database.module';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationProcessor } from './notifications/notifications.processor';

@Module({
	imports: [
		DatabaseModule,
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
		UsersModule,
		NotificationsModule,
		DatabaseModule,
	],
	controllers: [NotificationsController],
	providers: [NotificationsService, NotificationProcessor, UserService],
})
export class AppModule {}
