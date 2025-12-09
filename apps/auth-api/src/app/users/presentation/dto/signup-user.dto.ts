import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole, type UserRoleEnum } from 'src/app/users/domain/user.role';

export class SignupUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole, { always: true })
  role?: UserRoleEnum;
}
