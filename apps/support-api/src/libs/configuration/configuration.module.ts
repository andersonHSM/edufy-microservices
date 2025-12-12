import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import rabbitmqConfig from './rabbitmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [appConfig, databaseConfig, rabbitmqConfig],
      envFilePath: ['.env', '.env.local'],
    }),
  ],
})
export class ConfigurationModule {}
