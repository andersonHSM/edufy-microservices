import { Body, Controller, Get, Param, Post, UseFilters } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CoursesService } from "src/app/courses/application/courses.service";
import { CreateCourseDto } from "src/app/courses/presentation/dtos/create-course.dto";
import { CurrentUser } from "src/app/users/presentation/current-user.decorator";
import { Public } from "src/app/users/presentation/public.decorator";
import { RpcToHttpExceptionFilter } from "src/libs/exception-filters/rpc-to-http.exception-filter";

@Controller("courses")
@UseFilters(new RpcToHttpExceptionFilter())
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiBearerAuth()
  @Get("my-courses")
  public listMyCourses(@CurrentUser() subId: string) {
    console.log({ subId });
    return this.coursesService.listMyCourses(subId);
  }

  @ApiBearerAuth()
  @Post("")
  public createCourse(
    @CurrentUser() subId: string,
    @Body() body: CreateCourseDto,
  ) {
    return this.coursesService.createCourse(body, subId);
  }

  @Public()
  @Get("")
  public listCourses() {
    return this.coursesService.listCourses();
  }

  @Public()
  @Get(":id")
  public getCourseById(@Param("id") id: string) {
    return this.coursesService.getCourseById(id);
  }
}
