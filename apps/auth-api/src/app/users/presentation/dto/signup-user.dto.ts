import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength} from 'class-validator';
import {UserRole, type UserRoleEnum} from "src/app/users/domain/user.role";

export class SignupUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsEnum(UserRole, {always: true})
  @IsOptional()
  role?: UserRoleEnum;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsOptional()
  interests?: string[];

  @IsUrl()
  @IsOptional()
  profilePictureUrl?: string;
}
