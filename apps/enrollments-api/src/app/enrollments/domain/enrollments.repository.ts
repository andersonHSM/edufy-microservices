import { CreateEnrollmentInput, EnrollmentEntity } from './enrollment.entity';

export const EnrollmentsRepository = Symbol('EnrollmentsRepository');

export interface IEnrollmentsRepository {
  create(data: CreateEnrollmentInput): Promise<EnrollmentEntity>;
  findByUserId(userId: string): Promise<EnrollmentEntity[]>;
}
