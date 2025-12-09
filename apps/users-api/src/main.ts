import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import appConfig, { AppConfig } from 'src/libs/configuration/app.config';
import rabbitmqConfig, {
  RabbitMQConfig,
} from 'src/libs/configuration/rabbitmq.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rabbitMQConfig = app.get<RabbitMQConfig>(rabbitmqConfig.KEY);
  const appConfigs = app.get<AppConfig>(appConfig.KEY);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQConfig.url],
      queue: rabbitMQConfig.usersQueue,
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'users_dlx',
          'x-dead-letter-routing-key': 'users_dlq_routing_key',
        },
      },
      noAck: false,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: appConfigs.port,
    },
  });

  await app.startAllMicroservices();
}

bootstrap();
