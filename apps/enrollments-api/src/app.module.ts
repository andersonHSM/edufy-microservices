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
import usersServiceConfig from 'src/libs/configuration/users-service.config';
import { DatabaseModule } from 'src/libs/database/database.module';

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
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
