import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EnrollmentsRepository } from 'src/app/enrollments/domain/enrollments.repository';
import { KyselyEnrollmentsRepository } from 'src/app/enrollments/infrastructure/persistence/kysely.enrollments.repository';
import coursesServiceConfig from 'src/libs/configuration/courses-service.config';
import rabbitmqConfig from 'src/libs/configuration/rabbitmq.config';
import usersServiceConfig from 'src/libs/configuration/users-service.config';
import { DatabaseModule } from 'src/libs/database/database.module';

import { EnrollmentsService } from './application/enrollments.service';
import {
  COURSES_SERVICE,
  ENROLLMENTS_SERVICE,
  USERS_SERVICE,
} from './enrollments.constants';
import { EnrollmentsController } from './presentation/controllers/enrollments.controller';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.registerAsync([
      {
        name: USERS_SERVICE,
        useFactory: (config: ConfigType<typeof usersServiceConfig>) => ({
          transport: Transport.TCP,
          options: {
            host: config.host,
            port: config.port,
          },
        }),
        inject: [usersServiceConfig.KEY],
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
      {
        name: ENROLLMENTS_SERVICE,
        useFactory: (config: ConfigType<typeof rabbitmqConfig>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.url],
            queue: config.enrollmentsQueue,
            queueOptions: {
              durable: true,
              arguments: {
                'x-dead-letter-exchange': 'enrollments_dlx',
                'x-dead-letter-routing-key': 'enrollments_dlq_routing_key',
              },
            },
          },
        }),
        inject: [rabbitmqConfig.KEY],
      },
    ]),
  ],
  controllers: [EnrollmentsController],
  providers: [
    EnrollmentsService,
    {
      provide: EnrollmentsRepository,
      useClass: KyselyEnrollmentsRepository,
    },
  ],
})
export class EnrollmentsModule {}
