import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTicketDto {
  @ApiProperty({
    description: "Title of the support ticket",
    example: "Issue with course access",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: "Detailed description of the issue",
    example:
      'I cannot access my purchased course "Advanced NestJS". The link is broken.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
