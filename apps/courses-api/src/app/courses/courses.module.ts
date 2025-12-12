import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS_SERVICE } from 'src/app/courses/courses.constants';
import { CoursesRepository } from 'src/app/courses/domain/courses.repository';
import { KyselyCoursesRepository } from 'src/app/courses/infrastructure/persistence/kysely.courses.repository';
import authServiceConfig from 'src/libs/configuration/auth-service.config';
import rabbitmqConfig from 'src/libs/configuration/rabbitmq.config';
import usersServiceConfig from 'src/libs/configuration/users-service.config';
import { DatabaseModule } from 'src/libs/database/database.module';
import { CoursesService } from './application/courses.service';
import { AUTH_SERVICE } from './courses.constants';
import { CoursesController } from './presentation/controllers/courses.controller';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.registerAsync([
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
              arguments: {
                'x-dead-letter-exchange': 'users_dlx',
                'x-dead-letter-routing-key': 'users_dlq_routing_key',
              },
            },
          },
        }),
        inject: [rabbitmqConfig.KEY, usersServiceConfig.KEY],
      },
      {
        name: AUTH_SERVICE, // To validate instructor exists for course creation
        useFactory: (config: ConfigType<typeof authServiceConfig>) => ({
          transport: Transport.TCP,
          options: {
            host: config.host,
            port: config.port,
          },
        }),
        inject: [authServiceConfig.KEY],
      },
    ]),
  ],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    {
      provide: CoursesRepository,
      useClass: KyselyCoursesRepository,
    },
  ],
})
export class CoursesModule {}
