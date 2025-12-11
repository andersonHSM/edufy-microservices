import { Module } from "@nestjs/common";
import { SupportController } from "./presentation/controllers/support.controller";
import { SupportService } from "./support.service";

@Module({
  providers: [SupportService],
  controllers: [SupportController],
  exports: [SupportService],
})
export class SupportModule {}
