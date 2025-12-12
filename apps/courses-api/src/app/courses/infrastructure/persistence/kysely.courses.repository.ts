import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import {
  CourseEntity,
  CreateCourseInput,
} from 'src/app/courses/domain/course.entity';
import { ICoursesRepository } from 'src/app/courses/domain/courses.repository';
import { DATABASE } from 'src/libs/database/constants';
import { DB } from 'src/libs/database/generated/db';
import { KyselyRepository } from 'src/libs/database/kysely.repository';

@Injectable()
export class KyselyCoursesRepository
  extends KyselyRepository
  implements ICoursesRepository
{
  constructor(
    @Inject(DATABASE) protected override readonly database: Kysely<DB>,
  ) {
    super(database);
  }

  async create(data: CreateCourseInput): Promise<CourseEntity> {
    const course = CourseEntity.create(data);
    const createdCourse = await this.database
      .insertInto('courses.courses')
      .values({
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        instructorSubId: course.instructorSubId,
        instructorName: course.instructorName,
        instructorAvatar: course.instructorAvatar,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return CourseEntity.fromProps(createdCourse);
  }

  async findAll(): Promise<CourseEntity[]> {
    const courses = await this.database
      .selectFrom('courses.courses')
      .selectAll()
      .execute();
    return courses.map((course) => CourseEntity.fromProps(course));
  }

  async findById(id: string): Promise<CourseEntity | null> {
    const course = await this.database
      .selectFrom('courses.courses')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return course ? CourseEntity.fromProps(course) : null;
  }

  async findMyCourses(instructorSubId: string): Promise<CourseEntity[]> {
    const courses = await this.database
      .selectFrom('courses.courses')
      .selectAll()
      .where('instructorSubId', '=', instructorSubId)
      .execute();
    return courses.map((course) => CourseEntity.fromProps(course));
  }

  async updateInstructorInfo(
    instructorSubId: string,
    instructorName: string,
    instructorAvatar?: string,
  ): Promise<void> {
    await this.database
      .updateTable('courses.courses')
      .set({
        instructorName: instructorName,
        instructorAvatar: instructorAvatar,
        updatedAt: new Date(),
      })
      .where('instructorSubId', '=', instructorSubId)
      .execute();
  }
}
