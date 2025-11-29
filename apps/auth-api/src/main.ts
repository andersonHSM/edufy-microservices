import {NestFactory} from '@nestjs/core';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {AppModule} from './app.module';

async function bootstrap() {
	const PORT = process.env.PORT ?? '3000';

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.TCP,
		options: {
			port: parseInt(PORT, 10),
		}
	});

	await app.listen();
}

bootstrap();
