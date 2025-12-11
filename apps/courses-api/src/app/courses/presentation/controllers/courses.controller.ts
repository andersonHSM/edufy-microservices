import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CoursesService } from 'src/app/courses/application/courses.service';
import { UserUpdatedEvent } from 'src/app/users/events/user-updated.event';
import { CreateCourseDto } from '../dtos/create-course.dto';

@Controller()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @MessagePattern('create_course')
  async createCourse(@Payload() data: CreateCourseDto) {
    return this.coursesService.createCourse(data);
  }

  @MessagePattern('list_courses')
  async listCourses() {
    return this.coursesService.listCourses();
  }

  @MessagePattern('get_course_by_id')
  async getCourseById(@Payload() id: string) {
    return this.coursesService.getCourseById(id);
  }

  @MessagePattern('list_my_courses')
  async listMyCourses(@Payload() instructorSubId: string) {
    return this.coursesService.listMyCourses(instructorSubId);
  }

  @EventPattern('user_updated')
  async handleUserUpdated(
    @Payload() payload: UserUpdatedEvent,
    @Ctx() context: RmqContext,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.coursesService.handleUserUpdatedEvent(
        payload.sub_id, // This is still snake_case from the event
        payload.name, // This is still snake_case from the event
        payload.profilePictureUrl, // This is still snake_case from the event
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      channel.ack(originalMsg);
    } catch (error) {
      console.error('Failed to process user_updated event:', error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      channel.nack(originalMsg, false, false);
    }
  }
}
