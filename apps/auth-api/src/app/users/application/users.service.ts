import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as argon2 from 'argon2';
import { UserEntity } from 'src/app/users/domain/user.entity';
import {
  type IUserRepository,
  UserRepository,
} from 'src/app/users/domain/user.repository';

import { UserRoleEnum } from 'src/app/users/domain/user.role';
import { UserCreatedEvent } from 'src/app/users/events/user-created.event';
import { LoginDto } from 'src/app/users/presentation/dto/login.dto';
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

  public async updateRole(sub_id: string, role: string) {
    const user = await this.userRepository.findOneById(sub_id);
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: 404,
      });
    }

    user.role = role as UserRoleEnum;
    await this.userRepository.save(user);
  }

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

    // Emit event for other services (Async)
    this.usersClient.emit(
      'user_created',
      new UserCreatedEvent(
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

    // Return token (Sync)
    const token = await this.signJwtToken(newUser);
    return {
      user: {
        sub: newUser.sub,
        email: newUser.email,
        role: newUser.role,
      },
      jwtAccessToken: token,
    };
  }

  public async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneByEmail(loginDto.email);
    if (!user) {
      throw new RpcException({
        message: 'Invalid email or password',
        code: 401,
      });
    }

    const passwordMatch = await argon2.verify(user.password, loginDto.password);
    if (!passwordMatch) {
      throw new RpcException({
        message: 'Invalid email or password',
        code: 401,
      });
    }

    const token = await this.signJwtToken(user);
    return {
      jwtAccessToken: token,
    };
  }

  private async signJwtToken(user: UserEntity): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.sub,
      email: user.email,
      role: user.role,
    });
  }
}
