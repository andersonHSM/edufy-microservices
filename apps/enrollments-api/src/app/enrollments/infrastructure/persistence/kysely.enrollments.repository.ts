import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import {
  CreateEnrollmentInput,
  EnrollmentEntity,
  EnrollmentProps,
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
      .insertInto('enrollments.enrollments')
      .values({
        id: enrollment.id,
        studentSubId: enrollment.studentSubId,
        courseId: enrollment.courseId,
        status: enrollment.status,
        pricePaid: enrollment.pricePaid,
        courseTitle: enrollment.courseTitle,
        studentName: enrollment.studentName,
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
      .where('studentSubId', '=', userId)
      .execute();
    return enrollments.map((enrollment) =>
      EnrollmentEntity.fromProps(enrollment),
    );
  }

  async updateStatus(
    id: string,
    status: EnrollmentProps['status'],
  ): Promise<void> {
    await this.database
      .updateTable('enrollments.enrollments')
      .set({ status })
      .where('id', '=', id)
      .execute();
  }

  async findById(id: string): Promise<EnrollmentEntity | null> {
    const enrollment = await this.database
      .selectFrom('enrollments.enrollments')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    return enrollment ? EnrollmentEntity.fromProps(enrollment) : null;
  }
}
