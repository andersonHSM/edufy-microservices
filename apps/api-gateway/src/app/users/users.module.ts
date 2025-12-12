import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { UsersService } from "src/app/users/application/users.service";
import { JwtGuard } from "src/app/users/presentation/jwt.guard";
import { UsersController } from "src/app/users/presentation/users.controller";
import { ConfiguredJwtModule } from "src/libs/jwt/jwt.module";

@Module({
  imports: [ConfiguredJwtModule],
  controllers: [UsersController],
  providers: [UsersService, { provide: APP_GUARD, useClass: JwtGuard }],
})
export class UsersModule {}
