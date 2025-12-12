import { randomUUID, UUID } from 'node:crypto';

export interface CreateEnrollmentInput {
  studentSubId: string;
  courseId: string;
  status: 'pending' | 'completed' | 'failed';
  pricePaid: number;
  courseTitle: string;
  studentName: string;
  id?: UUID;
  enrolledAt?: Date;
}

export interface EnrollmentProps {
  id: string;
  studentSubId: string;
  courseId: string;
  status: string;
  pricePaid: string;
  enrolledAt: Date;
  courseTitle: string;
  studentName: string;
}

export class EnrollmentEntity {
  public static create(input: CreateEnrollmentInput): EnrollmentEntity {
    return new EnrollmentEntity(
      input.id ?? randomUUID(),
      input.studentSubId,
      input.courseId,
      input.status,
      input.pricePaid,
      input.enrolledAt ?? new Date(),
      input.courseTitle,
      input.studentName,
    );
  }

  public static fromProps(props: EnrollmentProps): EnrollmentEntity {
    return new EnrollmentEntity(
      props.id as UUID,
      props.studentSubId,
      props.courseId,
      props.status,
      parseFloat(props.pricePaid),
      props.enrolledAt,
      props.courseTitle,
      props.studentName,
    );
  }

  private constructor(
    public readonly id: UUID,
    public readonly studentSubId: string,
    public readonly courseId: string,
    public readonly status: string,
    public readonly pricePaid: number,
    public readonly enrolledAt: Date,
    public readonly courseTitle: string,
    public readonly studentName: string,
  ) {}
}
