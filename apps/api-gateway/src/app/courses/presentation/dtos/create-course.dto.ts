import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateCourseDto {
  @ApiProperty({
    description: "Title of the course",
    example: "Introduction to NestJS",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "Detailed description of the course",
    example: "Learn the fundamentals of NestJS framework.",
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: "Price of the course", example: 99.99 })
  @IsNumber()
  @Min(0)
  price: number;
}
