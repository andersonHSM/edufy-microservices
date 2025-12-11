import { randomUUID, UUID } from 'node:crypto';

export interface CreateEnrollmentInput {
  userId: string;
  courseId: string;
  id?: UUID;
}

export interface EnrollmentProps {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
}

export class EnrollmentEntity {
  public static create(input: CreateEnrollmentInput): EnrollmentEntity {
    return new EnrollmentEntity(
      input.id ?? randomUUID(),
      input.userId,
      input.courseId,
      new Date(), // enrolledAt
    );
  }

  public static fromProps(props: EnrollmentProps): EnrollmentEntity {
    return new EnrollmentEntity(
      props.id as UUID,
      props.userId,
      props.courseId,
      props.enrolledAt,
    );
  }

  private constructor(
    public readonly id: UUID,
    public readonly userId: string,
    public readonly courseId: string,
    public readonly enrolledAt: Date = new Date(),
  ) {}
}
