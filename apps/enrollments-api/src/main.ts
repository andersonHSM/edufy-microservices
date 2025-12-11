import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import appConfig from 'src/libs/configuration/app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfigs = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

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
