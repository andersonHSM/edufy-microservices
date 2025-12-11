import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EnrollmentsRepository } from 'src/app/enrollments/domain/enrollments.repository';
import { KyselyEnrollmentsRepository } from 'src/app/enrollments/infrastructure/persistence/kysely.enrollments.repository';
import authServiceConfig from 'src/libs/configuration/auth-service.config';
import coursesServiceConfig from 'src/libs/configuration/courses-service.config';
import { DatabaseModule } from 'src/libs/database/database.module';
import { EnrollmentsService } from './application/enrollments.service';
import { AUTH_SERVICE, COURSES_SERVICE } from './enrollments.constants';
import { EnrollmentsController } from './presentation/controllers/enrollments.controller';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (config: ConfigType<typeof authServiceConfig>) => ({
          transport: Transport.TCP,
          options: {
            host: config.host,
            port: config.port,
          },
        }),
        inject: [authServiceConfig.KEY],
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
