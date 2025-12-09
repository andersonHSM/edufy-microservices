import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import * as argon2 from 'argon2';
import { UserEntity } from 'src/app/users/domain/user.entity';
import {
  type IUserRepository,
  UserRepository,
} from 'src/app/users/domain/user.repository';
import { SignupUserDto } from 'src/app/users/presentation/dto/signup-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
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
    return newUser;
  }
}
