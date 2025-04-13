import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: ['amqp://localhost:5672'],
			queue: 'notification_queue',
			queueOptions: { durable: true },
		},
	});

	await app.startAllMicroservices();

	await app.listen(process.env.PORT ?? 3000);
	console.log('----------------Push Notification---------------------');
	console.log('APP IS RUNNING ON PORT', process.env.PORT ?? 3000);
}
bootstrap();
