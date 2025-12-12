import { Module } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppController } from "src/app.controller";
import { AppService } from "src/app.service";
import { AUTH_SERVICE } from "src/app/auth/auth.constants";
import { AuthModule } from "src/app/auth/auth.module";
import { COURSES_TCP_SERVICE } from "src/app/courses/courses.constants";
import { CoursesModule } from "src/app/courses/courses.module";
import { ENROLLMENTS_SERVICE } from "src/app/enrollments/application/enrollments.service";
import { EnrollmentsModule } from "src/app/enrollments/enrollments.module";
import {
  USERS_RMQ_SERVICE,
  USERS_TCP_SERVICE,
} from "src/app/users/users.constants";
import { UsersModule } from "src/app/users/users.module";
import authServiceConfig from "src/libs/configuration/auth-service.config";
import { ConfigurationModule } from "src/libs/configuration/configuration.module";
import coursesServiceConfig from "src/libs/configuration/courses-service.config";
import enrollmentsServiceConfig from "src/libs/configuration/enrollments-service.config";
import rabbitmqConfig from "src/libs/configuration/rabbitmq.config";
import usersServiceConfig from "src/libs/configuration/users-service.config";
import { RpcToHttpExceptionFilter } from "src/libs/exception-filters/rpc-to-http.exception-filter";
import { ConfiguredJwtModule } from "src/libs/jwt/jwt.module";
import { JwtGuard } from "./app/users/presentation/jwt.guard";

@Module({
  imports: [
    ConfigurationModule,
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
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
          name: USERS_TCP_SERVICE,
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
          name: USERS_RMQ_SERVICE,
          useFactory: (config: ConfigType<typeof rabbitmqConfig>) => ({
            transport: Transport.RMQ,
            options: {
              urls: [config.url],
              queue: config.usersQueue,
              queueOptions: {
                durable: true,
                arguments: {
                  "x-dead-letter-exchange": "users_dlx",
                  "x-dead-letter-routing-key": "users_dlq_routing_key",
                },
              },
            },
          }),
          inject: [rabbitmqConfig.KEY],
        },
        {
          name: COURSES_TCP_SERVICE,
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
          useFactory: (
            config: ConfigType<typeof enrollmentsServiceConfig>,
          ) => ({
            transport: Transport.TCP,
            options: {
              host: config.host,
              port: config.port,
            },
          }),
          inject: [enrollmentsServiceConfig.KEY],
        },
      ],
    }),
    ConfiguredJwtModule,
    UsersModule,
    AuthModule,
    CoursesModule,
    EnrollmentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtGuard },
    { provide: APP_FILTER, useClass: RpcToHttpExceptionFilter },
  ],
})
export class AppModule {}
