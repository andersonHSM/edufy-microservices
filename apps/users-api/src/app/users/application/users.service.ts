import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UserEntity } from 'src/app/users/domain/user.entity';
import {
  type IUserRepository,
  UserRepository,
} from 'src/app/users/domain/user.repository';
import { UserRoleAssignedEvent } from 'src/app/users/events/user-role-assigned.event';
import { UserSignedUpEvent } from 'src/app/users/events/user-signed-up.event';
import { UpdateUserDto } from 'src/app/users/presentation/dto/update-user.dto';
import { AUTH_SERVICE } from 'src/app/users/users.constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: IUserRepository,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}
  public async createUser(payload: UserSignedUpEvent) {
    const userExists = await this.userRepository.findOneByEmail(payload.email);
    if (userExists) {
      throw new RpcException({
        message: 'Email already in use',
        code: 409,
      });
    }

    const newUser = UserEntity.create(payload);

    await this.userRepository.save(newUser);
    return newUser;
  }

  public getUserById(subId: string) {
    return this.userRepository.findOneById(subId);
  }

  public async updateUser(subId: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findOneById(subId);
    if (!user) throw new RpcException({ message: 'User not found', code: 404 });

    user.sub_id = subId;
    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;
    if (dto.biography) user.biography = dto.biography;
    if (dto.interests) user.interests = dto.interests;
    if (dto.profilePictureUrl) user.profilePictureUrl = dto.profilePictureUrl;

    await this.userRepository.save(user);
    return user;
  }

  public async assignRole(subId: string, role: string) {
    const user = await this.userRepository.findOneById(subId);
    if (!user) throw new RpcException({ message: 'User not found', code: 404 });

    user.role = role;
    await this.userRepository.save(user);

    this.authClient.emit(
      'user_role_assigned',
      new UserRoleAssignedEvent(subId, role),
    );

    return user;
  }
}
