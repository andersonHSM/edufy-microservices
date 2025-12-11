import { Module } from "@nestjs/common";
import { UsersService } from "src/app/users/application/users.service";
import { UsersController } from "src/app/users/presentation/users.controller";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
