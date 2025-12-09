import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as argon2 from 'argon2';
import { UserEntity } from 'src/app/users/domain/user.entity';
import {
  type IUserRepository,
  UserRepository,
} from 'src/app/users/domain/user.repository';
import { UserSignedUpEvent } from 'src/app/users/events/user-signed-up.event';
import { SignupUserDto } from 'src/app/users/presentation/dto/signup-user.dto';
import { USERS_SERVICE } from 'src/app/users/users.constants';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {}

  public async create(signupUserDto: SignupUserDto) {
    const userExists = await this.userRepository.findOneByEmail(
      signupUserDto.email,
    );
    if (userExists) {
      throw new RpcException({
        message: 'Email already in use',
        code: 409,
      });
    }
    const newUser = UserEntity.create({
      email: signupUserDto.email,
      password: await argon2.hash(signupUserDto.password),
      role: signupUserDto.role,
    });

    await this.userRepository.save(newUser);

    this.usersClient.emit(
      'user_signed_up',
      new UserSignedUpEvent(
        newUser.sub,
        newUser.email,
        signupUserDto.firstName,
        signupUserDto.lastName,
        signupUserDto.role,
        signupUserDto.biography,
        signupUserDto.interests,
        signupUserDto.profilePictureUrl,
      ),
    );

    return newUser;
  }
}
