import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE, USERS_SERVICE } from 'src/app/courses/courses.constants';
import {
  CoursesRepository,
  type ICoursesRepository,
} from 'src/app/courses/domain/courses.repository';
import { UserEntity } from 'src/app/users/domain/user.entity';
import { CreateCourseDto } from '../presentation/dtos/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @Inject(CoursesRepository)
    private readonly coursesRepository: ICoursesRepository,
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  async createCourse(dto: CreateCourseDto) {
    // 1. Validate instructorSubId exists and has a valid role (e.g., instructor)
    // from auth-api (TCP call)
    const authUser = await firstValueFrom(
      this.authClient.send<Pick<UserEntity, 'role' | 'sub_id' | 'email'>>(
        'validate_user_exists_and_role',
        {
          sub_id: dto.instructorSubId,
          role: 'instructor',
        },
      ),
    ).catch((err: Error) => {
      throw new RpcException(
        `Auth service error during instructor validation: ${err.message}`,
      );
    });

    if (!authUser || authUser.role !== 'instructor') {
      throw new RpcException(
        'Instructor not found or does not have instructor role',
      );
    }

    // 2. Get instructor name and avatar from users-api (TCP call) for duplication
    const instructorProfile = await firstValueFrom(
      this.usersClient.send<UserEntity>('getUserById', dto.instructorSubId),
    ).catch((err: Error) => {
      throw new RpcException(
        `Users service error fetching instructor profile: ${err.message}`,
      );
    });

    if (!instructorProfile) {
      throw new RpcException('Instructor profile not found in users service');
    }

    return this.coursesRepository.create({
      title: dto.title,
      description: dto.description,
      price: dto.price,
      instructorSubId: instructorProfile.sub_id,
      instructorName: `${instructorProfile.firstName} ${instructorProfile.lastName}`,
      instructorAvatar: instructorProfile.profilePictureUrl,
    });
  }

  async listCourses() {
    return this.coursesRepository.findAll();
  }

  async getCourseById(id: string) {
    return this.coursesRepository.findById(id);
  }

  async listMyCourses(instructorSubId: string) {
    return this.coursesRepository.findMyCourses(instructorSubId);
  }

  async handleUserUpdatedEvent(
    instructorSubId: string,
    instructorName: string,
    instructorAvatar?: string,
  ) {
    await this.coursesRepository.updateInstructorInfo(
      instructorSubId,
      instructorName,
      instructorAvatar,
    );
  }
}
