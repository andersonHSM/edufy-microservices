import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import coursesServiceConfig from './courses-service.config';
import databaseConfig from './database.config';
import rabbitmqConfig from './rabbitmq.config';
import usersServiceConfig from './users-service.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [
        appConfig,
        databaseConfig,
        rabbitmqConfig,
        usersServiceConfig,
        coursesServiceConfig,
      ],
      envFilePath: ['.env', '.env.local'],
    }),
  ],
})
export class ConfigurationModule {}
