import { randomUUID, UUID } from "node:crypto";

export interface CreateCourseInput {
  title: string;
  description: string;
  price: number;
  instructorSubId: string;
  instructorName: string;
  instructorAvatar?: string;
  id?: UUID;
}

export interface CourseProps {
  id: string;
  title: string;
  description: string;
  price: string;
  instructorSubId: string;
  instructorName: string;
  instructorAvatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CourseEntity {
  public static create(input: CreateCourseInput): CourseEntity {
    return new CourseEntity(
      input.id ?? randomUUID(),
      input.title,
      input.description,
      input.price,
      input.instructorSubId,
      input.instructorName,
      input.instructorAvatar,
      new Date(), // createdAt
      new Date(), // updatedAt
    );
  }

  public static fromProps(props: CourseProps): CourseEntity {
    return new CourseEntity(
      props.id as UUID,
      props.title,
      props.description,
      parseFloat(props.price),
      props.instructorSubId,
      props.instructorName,
      props.instructorAvatar,
      props.createdAt,
      props.updatedAt,
    );
  }

  private constructor(
    public readonly id: UUID,
    public title: string,
    public description: string,
    public price: number,
    public readonly instructorSubId: string,
    public instructorName: string,
    public instructorAvatar?: string | null,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
