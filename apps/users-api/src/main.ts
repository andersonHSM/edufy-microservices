import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import rabbitmqConfig, {
  RabbitMQConfig,
} from 'src/libs/configuration/rabbitmq.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const config = appContext.get<RabbitMQConfig>(rabbitmqConfig.KEY);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [config.url],
        queue: config.usersQueue,
        queueOptions: {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': 'users_dlx',
            'x-dead-letter-routing-key': 'users_dlq_routing_key',
          },
        },
        noAck: false,
      },
    },
  );

  await app.listen();
}

bootstrap();
