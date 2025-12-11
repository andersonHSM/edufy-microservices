import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  COURSES_SERVICE,
  USERS_SERVICE,
} from 'src/app/enrollments/enrollments.constants';
import { EnrollmentsModule } from 'src/app/enrollments/enrollments.module';
import { ConfigurationModule } from 'src/libs/configuration/configuration.module';
import coursesServiceConfig from 'src/libs/configuration/courses-service.config';
import rabbitmqConfig from 'src/libs/configuration/rabbitmq.config';
import usersServiceConfig from 'src/libs/configuration/users-service.config';
import { DatabaseModule } from 'src/libs/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigurationModule,
    EnrollmentsModule,
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: USERS_SERVICE,
          useFactory: (
            rabbitConfig: ConfigType<typeof rabbitmqConfig>,
            usersConfig: ConfigType<typeof usersServiceConfig>,
          ) => ({
            transport: Transport.RMQ,
            options: {
              urls: [rabbitConfig.url],
              queue: usersConfig.queue,
              queueOptions: {
                durable: true,
              },
            },
          }),
          inject: [rabbitmqConfig.KEY, usersServiceConfig.KEY],
        },
        {
          name: COURSES_SERVICE,
          useFactory: (config: ConfigType<typeof coursesServiceConfig>) => ({
            transport: Transport.TCP,
            options: {
              host: config.host,
              port: config.port,
            },
          }),
          inject: [coursesServiceConfig.KEY],
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
