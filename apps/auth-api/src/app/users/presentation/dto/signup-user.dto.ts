import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { UserRole, type UserRoleEnum } from 'src/app/users/domain/user.role';

export class SignupUserDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user account (min 8 characters)',
    example: 'SecureP@ssw0rd',
  })
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Role of the user (e.g., student, instructor)',
    enum: UserRole,
    enumName: 'UserRole',
    example: UserRole.Student,
    required: false,
  })
  @IsEnum(UserRole, { always: true })
  @IsOptional()
  role?: UserRoleEnum;

  @ApiProperty({
    description: 'Biography of the user',
    example: 'Experienced software engineer.',
    required: false,
  })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiProperty({
    description: 'List of interests for the user',
    type: [String],
    example: ['programming', 'reading'],
    required: false,
  })
  @IsOptional()
  interests?: string[];

  @ApiProperty({
    description: "URL to the user's profile picture",
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  profilePictureUrl?: string;
}
