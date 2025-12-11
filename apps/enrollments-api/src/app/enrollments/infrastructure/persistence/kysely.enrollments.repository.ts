import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import {
  CreateEnrollmentInput,
  EnrollmentEntity,
} from 'src/app/enrollments/domain/enrollment.entity';
import { IEnrollmentsRepository } from 'src/app/enrollments/domain/enrollments.repository';
import { DATABASE } from 'src/libs/database/constants';
import { DB } from 'src/libs/database/generated/db';
import { KyselyRepository } from 'src/libs/database/kysely.repository';

@Injectable()
export class KyselyEnrollmentsRepository
  extends KyselyRepository
  implements IEnrollmentsRepository
{
  constructor(
    @Inject(DATABASE) protected override readonly database: Kysely<DB>,
  ) {
    super(database);
  }

  async create(data: CreateEnrollmentInput): Promise<EnrollmentEntity> {
    const enrollment = EnrollmentEntity.create(data);
    const createdEnrollment = await this.database
      .insertInto('enrollments.enrollments') // schema and table
      .values({
        id: enrollment.id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        enrolledAt: enrollment.enrolledAt,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return EnrollmentEntity.fromProps(createdEnrollment);
  }

  async findByUserId(userId: string): Promise<EnrollmentEntity[]> {
    const enrollments = await this.database
      .selectFrom('enrollments.enrollments')
      .selectAll()
      .where('userId', '=', userId)
      .execute();
    return enrollments.map((enrollment) =>
      EnrollmentEntity.fromProps(enrollment),
    );
  }
}
