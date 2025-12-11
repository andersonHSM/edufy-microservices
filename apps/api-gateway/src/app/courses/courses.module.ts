import { Module } from "@nestjs/common";
import { CoursesService } from "src/app/courses/application/courses.service";
import { CoursesController } from "src/app/courses/presentation/controllers/courses.controller";

@Module({
  imports: [],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
