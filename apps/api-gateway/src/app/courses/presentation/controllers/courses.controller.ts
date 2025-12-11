import { Body, Controller, Get, Param, Post, UseFilters } from "@nestjs/common";
import { CoursesService } from "src/app/courses/application/courses.service";
import { CreateCourseDto } from "src/app/courses/presentation/dtos/create-course.dto";
import { CurrentUser } from "src/app/users/presentation/current-user.decorator";
import { Public } from "src/app/users/presentation/public.decorator";
import { RpcToHttpExceptionFilter } from "src/libs/exception-filters/rpc-to-http.exception-filter";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseFilters(new RpcToHttpExceptionFilter())
  @Post("")
  public createCourse(@CurrentUser() user: any, @Body() body: CreateCourseDto) {
    return this.coursesService.createCourse(body, user.sub);
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

  @Get("my-courses")
  public listMyCourses(@CurrentUser() user: any) {
    return this.coursesService.listMyCourses(user.sub);
  }
}
