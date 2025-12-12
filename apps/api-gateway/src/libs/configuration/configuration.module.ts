import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "src/libs/config/configuration";
import usersServiceConfig from "src/libs/configuration/users-service.config";
import adminConfig from "./admin.config";
import authServiceConfig from "./auth-service.config";
import coursesServiceConfig from "./courses-service.config";
import databaseConfig from "./database.config";
import jwtConfig from "./jwt.config";
import rabbitmqConfig from "./rabbitmq.config";
import webhookConfig from "./webhook.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env", ".env.local"],
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [
        configuration,
        jwtConfig,
        adminConfig,
        databaseConfig,
        webhookConfig,
        rabbitmqConfig,
        authServiceConfig,
        usersServiceConfig,
        coursesServiceConfig,
      ],
    }),
  ],
})
export class ConfigurationModule {}
