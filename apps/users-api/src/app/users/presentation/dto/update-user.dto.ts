import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsArray()
  @IsOptional()
  interests?: string[];

  @IsUrl()
  @IsOptional()
  profilePictureUrl?: string;
}
