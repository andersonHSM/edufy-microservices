import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, firstValueFrom, throwError, timeout } from "rxjs";
import { CourseEntity } from "src/app/courses/domain/course.entity";
import { COURSES_TCP_SERVICE } from "../courses.constants";
import { CreateCourseDto } from "../presentation/dtos/create-course.dto";

@Injectable()
export class CoursesService {
  constructor(
    @Inject(COURSES_TCP_SERVICE)
    private readonly coursesTcpClientProxy: ClientProxy,
  ) {}

  public async createCourse(dto: CreateCourseDto, instructorSubId: string) {
    return firstValueFrom(
      this.coursesTcpClientProxy
        .send<CourseEntity>("create_course", { ...dto, instructorSubId })
        .pipe(
          timeout(5000),
          catchError((err: Error) => {
            return throwError(() => new RpcException(err));
          }),
        ),
    );
  }

  public async listCourses() {
    return firstValueFrom(
      this.coursesTcpClientProxy.send<CourseEntity[]>("list_courses", {}).pipe(
        timeout(5000),
        catchError((err: Error) => {
          return throwError(() => new RpcException(err));
        }),
      ),
    );
  }

  public async getCourseById(id: string) {
    return firstValueFrom(
      this.coursesTcpClientProxy
        .send<CourseEntity>("get_course_by_id", id)
        .pipe(
          timeout(5000),
          catchError((err: Error) => {
            return throwError(() => new RpcException(err));
          }),
        ),
    );
  }

  public async listMyCourses(instructor_sub_id: string) {
    return firstValueFrom(
      this.coursesTcpClientProxy
        .send<CourseEntity[]>("list_my_courses", instructor_sub_id)
        .pipe(
          timeout(5000),
          catchError((err: Error) => {
            return throwError(() => new RpcException(err));
          }),
        ),
    );
  }
}
