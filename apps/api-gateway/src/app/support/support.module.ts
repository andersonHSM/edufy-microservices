import { Module } from "@nestjs/common";
import { ConfiguredJwtModule } from "src/libs/jwt/jwt.module";
import { SupportController } from "./presentation/controllers/support.controller";
import { SupportService } from "./support.service";

@Module({
  imports: [ConfiguredJwtModule],
  providers: [SupportService],
  controllers: [SupportController],
  exports: [SupportService],
})
export class SupportModule {}
