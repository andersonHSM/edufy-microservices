import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    description: "First name of the user",
    example: "Jane",
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: "Last name of the user",
    example: "Doe",
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: "Biography of the user",
    example: "A passionate learner and educator.",
    required: false,
  })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiProperty({
    description: "List of interests for the user",
    type: [String],
    example: ["history", "art"],
    required: false,
  })
  @IsArray()
  @IsOptional()
  interests?: string[];

  @ApiProperty({
    description: "URL to the user's profile picture",
    example: "https://example.com/jane_avatar.jpg",
    required: false,
  })
  @IsUrl()
  @IsOptional()
  profilePictureUrl?: string;
}
