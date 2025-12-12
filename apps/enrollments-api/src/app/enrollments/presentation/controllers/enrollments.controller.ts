import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { EnrollmentsService } from 'src/app/enrollments/application/enrollments.service';
import { CreateEnrollmentDto } from '../dtos/create-enrollment.dto';

@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @MessagePattern('create_enrollment')
  async createEnrollment(@Payload() data: CreateEnrollmentDto) {
    return this.enrollmentsService.create(data);
  }

  @EventPattern('enroll_student_request')
  async enrollStudent(
    @Payload() data: { enrollment_id: string },
    @Ctx() context: RmqContext,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const channel: any = context.getChannelRef();

    const originalMsg: any = context.getMessage();
    try {
      await this.enrollmentsService.enrollStudent(data.enrollment_id);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      channel.ack(originalMsg);
    } catch (error) {
      console.error('Failed to process enroll_student_request:', error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      channel.nack(originalMsg, false, false); // Requeue = false, All Up To = false (send to DLQ if configured)
    }
  }

  @MessagePattern('list_my_enrollments')
  async listMyEnrollments(@Payload() userId: string) {
    return this.enrollmentsService.listMyEnrollments(userId);
  }

  @MessagePattern('get_purchase_history')
  async getPurchaseHistory(@Payload() userId: string) {
    return this.enrollmentsService.getPurchaseHistory(userId);
  }

  @MessagePattern('get_enrollment_by_id')
  async getEnrollmentById(@Payload() id: string) {
    return this.enrollmentsService.getEnrollmentById(id);
  }
}
