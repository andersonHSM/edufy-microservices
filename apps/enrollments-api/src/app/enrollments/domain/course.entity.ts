import { UUID } from 'node:crypto';

export type CourseProps = {
  id: UUID;
  title: string;
  price: number;
};

export class CourseEntity {
  public static fromProps(props: CourseProps): CourseEntity {
    return new CourseEntity(props.id, props.title, props.price);
  }

  private constructor(
    public readonly id: UUID,
    public readonly title: string,
    public readonly price: number,
  ) {}
}
