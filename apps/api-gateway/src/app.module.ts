import { Module } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppController } from "src/app.controller";
import { AppService } from "src/app.service";
import { AUTH_SERVICE } from "src/app/auth/auth.constants";
import {
  USERS_RMQ_SERVICE,
  USERS_TCP_SERVICE,
} from "src/app/users/users.constants";
import { UsersModule } from "src/app/users/users.module";
import authServiceConfig from "src/libs/configuration/auth-service.config";
import { ConfigurationModule } from "src/libs/configuration/configuration.module";
import rabbitmqConfig from "src/libs/configuration/rabbitmq.config";
import usersServiceConfig from "src/libs/configuration/users-service.config";
import { RpcToHttpExceptionFilter } from "src/libs/exception-filters/rpc-to-http.exception-filter";

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
                durable: false,
              },
            },
          }),
          inject: [rabbitmqConfig.KEY],
        },
      ],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: RpcToHttpExceptionFilter },
  ],
})
export class AppModule {}
