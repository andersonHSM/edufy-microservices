import { Module } from "@nestjs/common";
import { AuthService } from "src/app/auth/application/auth.service";
import { AuthController } from "src/app/auth/presentation/auth.controller";

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
