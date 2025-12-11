import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EnrollmentsService } from 'src/app/enrollments/application/enrollments.service';
import { CreateEnrollmentDto } from '../dtos/create-enrollment.dto';

@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @MessagePattern('create_enrollment')
  async createEnrollment(@Payload() data: CreateEnrollmentDto) {
    return this.enrollmentsService.create(data);
  }

  @MessagePattern('list_my_enrollments')
  async listMyEnrollments(@Payload() userId: string) {
    return this.enrollmentsService.listMyEnrollments(userId);
  }
}
