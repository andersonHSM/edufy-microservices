import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { EnrollmentsService } from "src/app/enrollments/application/enrollments.service";
import { CreateEnrollmentDto } from "src/app/enrollments/presentation/dto/create-enrollment.dto";
import { CurrentUser } from "src/app/users/presentation/current-user.decorator";
import { JwtGuard } from "src/app/users/presentation/jwt.guard";
import { RpcToHttpExceptionFilter } from "src/libs/exception-filters/rpc-to-http.exception-filter";

@Controller("enrollments")
@UseGuards(JwtGuard)
@UseFilters(new RpcToHttpExceptionFilter())
@ApiBearerAuth()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create({
      ...createEnrollmentDto,
    });
  }

  @Get("my-enrollments")
  listMyEnrollments(@CurrentUser() userSub: string) {
    console.log({ userSub });
    return this.enrollmentsService.listMyEnrollments(userSub);
  }

  @Get("my-history")
  getPurchaseHistory(@CurrentUser() userSub: string) {
    return this.enrollmentsService.getPurchaseHistory(userSub);
  }

  @Get(":id")
  getEnrollmentById(@Param("id") id: string) {
    return this.enrollmentsService.getEnrollmentById(id);
  }
}
