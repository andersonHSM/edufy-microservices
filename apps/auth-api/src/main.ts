import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import rabbitmqConfig from 'src/libs/configuration/rabbitmq.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rabbitConfig = app.get<ConfigType<typeof rabbitmqConfig>>(
    rabbitmqConfig.KEY,
  );
  const port = process.env.PORT ?? '3000';

  // TCP Microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(port, 10),
    },
  });

  // RabbitMQ Microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitConfig.url],
      queue: rabbitConfig.authQueue,
      noAck: false,
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'auth_dlx',
          'x-dead-letter-routing-key': 'auth_dlq_routing_key',
        },
      },
    },
  });

  await app.startAllMicroservices();
}

bootstrap();
