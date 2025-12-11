import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EnrollmentsRepository,
  type IEnrollmentsRepository,
} from 'src/app/enrollments/domain/enrollments.repository';
import {
  AUTH_SERVICE,
  COURSES_SERVICE,
} from 'src/app/enrollments/enrollments.constants';
import { CreateEnrollmentDto } from 'src/app/enrollments/presentation/dtos/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject(EnrollmentsRepository)
    private readonly enrollmentsRepository: IEnrollmentsRepository,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(COURSES_SERVICE) private readonly coursesClient: ClientProxy,
  ) {}

  async create(dto: CreateEnrollmentDto & { userId: string }) {
    // Business logic to create an enrollment
    // 1. Validate user exists (from auth-api)
    // 2. Validate course exists (from courses-api)
    // 3. Create enrollment
    return this.enrollmentsRepository.create(dto);
  }

  async listMyEnrollments(userId: string) {
    return this.enrollmentsRepository.findByUserId(userId);
  }
}
