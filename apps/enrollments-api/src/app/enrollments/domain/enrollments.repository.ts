import {
  CreateEnrollmentInput,
  EnrollmentEntity,
  EnrollmentProps,
} from './enrollment.entity';

export const EnrollmentsRepository = Symbol('EnrollmentsRepository');

export interface IEnrollmentsRepository {
  create(data: CreateEnrollmentInput): Promise<EnrollmentEntity>;
  findByUserId(userId: string): Promise<EnrollmentEntity[]>;
  updateStatus(id: string, status: EnrollmentProps['status']): Promise<void>;
  findById(id: string): Promise<EnrollmentEntity | null>;
}
