import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength} from 'class-validator';

export class SignupUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(8)
  password: string;

  @ApiProperty({enum: ['support_agent', 'student', 'instructor']})
  @IsEnum(['support_agent', 'student', 'instructor'])
  @IsOptional()
  role?: 'support_agent' | 'student' | 'instructor';

  @ApiProperty()
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiProperty()
  @IsOptional()
  interests?: string[];

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  profilePictureUrl?: string;
}
