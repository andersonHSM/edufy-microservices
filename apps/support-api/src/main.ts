import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import appConfig from './libs/configuration/app.config';
import rabbitmqConfig from './libs/configuration/rabbitmq.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rabbitMQConfig = app.get<ConfigType<typeof rabbitmqConfig>>(
    rabbitmqConfig.KEY,
  );
  const appConfigs = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQConfig.url],
      queue: rabbitMQConfig.supportQueue,
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'support_dlx',
          'x-dead-letter-routing-key': 'support_dlq_routing_key',
        },
      },
      noAck: false,
    },
  });

  // TCP Microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: appConfigs.port,
    },
  });

  await app.startAllMicroservices();
}
void bootstrap();
