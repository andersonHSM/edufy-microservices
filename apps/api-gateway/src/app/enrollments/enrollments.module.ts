import { Module } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import {
  ENROLLMENTS_SERVICE,
  EnrollmentsService,
} from "src/app/enrollments/application/enrollments.service";
import { EnrollmentsController } from "src/app/enrollments/presentation/controllers/enrollments.controller";
import enrollmentsServiceConfig from "src/libs/configuration/enrollments-service.config";
import { ConfiguredJwtModule } from "src/libs/jwt/jwt.module";

@Module({
  imports: [
    ConfiguredJwtModule,
    ClientsModule.registerAsync([
      {
        name: ENROLLMENTS_SERVICE,
        useFactory: (config: ConfigType<typeof enrollmentsServiceConfig>) => ({
          transport: Transport.TCP,
          options: {
            host: config.host,
            port: config.port,
          },
        }),
        inject: [enrollmentsServiceConfig.KEY],
      },
    ]),
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
