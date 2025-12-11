import { Body, Controller, Post, UseFilters, UseGuards } from "@nestjs/common";
import { EnrollmentsService } from "src/app/enrollments/application/enrollments.service";
import { CreateEnrollmentDto } from "src/app/enrollments/presentation/dto/create-enrollment.dto";
import { CurrentUser } from "src/app/users/presentation/current-user.decorator";
import { JwtGuard } from "src/app/users/presentation/jwt.guard";
import { RpcToHttpExceptionFilter } from "src/libs/exception-filters/rpc-to-http.exception-filter";

@Controller("enrollments")
@UseGuards(JwtGuard)
@UseFilters(new RpcToHttpExceptionFilter())
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.enrollmentsService.create({
      ...createEnrollmentDto,
      studentSubId: user.sub,
    });
  }
}
