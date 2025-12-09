import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserEntity } from 'src/app/users/domain/user.entity';
import {
  type IUserRepository,
  UserRepository,
} from 'src/app/users/domain/user.repository';
import { UserSignedUpEvent } from 'src/app/users/events/user-signed-up.event';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: IUserRepository,
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
}
