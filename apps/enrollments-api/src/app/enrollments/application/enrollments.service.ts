import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CourseEntity } from 'src/app/enrollments/domain/course.entity';
import {
  EnrollmentsRepository,
  type IEnrollmentsRepository,
} from 'src/app/enrollments/domain/enrollments.repository';
import { UserEntity } from 'src/app/enrollments/domain/user.entity';
import {
  COURSES_SERVICE,
  ENROLLMENTS_SERVICE,
  USERS_SERVICE,
} from 'src/app/enrollments/enrollments.constants';
import { CreateEnrollmentDto } from 'src/app/enrollments/presentation/dtos/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  private readonly logger = new Logger(EnrollmentsService.name);

  constructor(
    @Inject(EnrollmentsRepository)
    private readonly enrollmentsRepository: IEnrollmentsRepository,
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
    @Inject(COURSES_SERVICE) private readonly coursesClient: ClientProxy,
    @Inject(ENROLLMENTS_SERVICE)
    private readonly enrollmentsClient: ClientProxy,
  ) {}

  async create(dto: CreateEnrollmentDto) {
    this.logger.log('Create enrollment process started');
    const { courseId, studentSubId } = dto;

    console.log(dto);
    const [user, course] = await Promise.all([
      firstValueFrom(
        this.usersClient.send<UserEntity>('getUserById', studentSubId),
      ),
      firstValueFrom(
        this.coursesClient.send<CourseEntity>('get_course_by_id', courseId),
      ),
    ]);

    console.log({ user });
    if (!course) {
      throw new RpcException({ message: 'Course not foud', status: 404 });
    }

    this.logger.log('User and course fetched successfully');

    const enrollment = await this.enrollmentsRepository.create({
      courseId,
      studentSubId,
      status: 'pending',
      pricePaid: course?.price,
      courseTitle: course?.title,
      studentName: `${user.firstName} ${user.lastName}`,
    });

    this.logger.log('Enrollment created, emitting event');

    this.enrollmentsClient.emit('enroll_student_request', {
      enrollment_id: enrollment.id,
    });

    return enrollment;
  }

  async enrollStudent(enrollmentId: string) {
    this.logger.log(`Processing enrollment for enrollmentId: ${enrollmentId}`);
    await this.enrollmentsRepository.updateStatus(enrollmentId, 'completed');
    this.logger.log(`Enrollment ${enrollmentId} processed successfully`);
  }

  async listMyEnrollments(userId: string) {
    return this.enrollmentsRepository.findByUserId(userId);
  }
}
