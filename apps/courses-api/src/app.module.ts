import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS_SERVICE } from 'src/app/courses/courses.constants'; // This constant will be created later
import { CoursesModule } from 'src/app/courses/courses.module'; // This module will be created later
import { ConfigurationModule } from 'src/libs/configuration/configuration.module';
import rabbitmqConfig from 'src/libs/configuration/rabbitmq.config';
import usersServiceConfig from 'src/libs/configuration/users-service.config'; // This will be needed to connect to users-api
import { DatabaseModule } from 'src/libs/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigurationModule,
    CoursesModule,
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: USERS_SERVICE,
          useFactory: (
            rabbitConfig: ConfigType<typeof rabbitmqConfig>,
            usersConfig: ConfigType<typeof usersServiceConfig>,
          ) => ({
            transport: Transport.RMQ, // Assuming user updates will come via RMQ
            options: {
              urls: [rabbitConfig.url],
              queue: usersConfig.queue, // This should be users_queue
              queueOptions: {
                durable: true,
                arguments: {
                  'x-dead-letter-exchange': 'users_dlx',
                  'x-dead-letter-routing-key': 'users_dlq_routing_key',
                },
              },
            },
          }),
          inject: [rabbitmqConfig.KEY, usersServiceConfig.KEY],
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
