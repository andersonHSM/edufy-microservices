import { CourseEntity, CreateCourseInput } from './course.entity';

export const CoursesRepository = Symbol('CoursesRepository');

export interface ICoursesRepository {
  create(data: CreateCourseInput): Promise<CourseEntity>;
  findAll(): Promise<CourseEntity[]>;
  findById(id: string): Promise<CourseEntity | null>;
  findMyCourses(instructorSubId: string): Promise<CourseEntity[]>;
  updateInstructorInfo(
    instructorSubId: string,
    instructorName: string,
    instructorAvatar?: string,
  ): Promise<void>;
}
