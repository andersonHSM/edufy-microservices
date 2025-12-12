import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateEnrollmentDto {
  @ApiProperty()
  @IsString()
  courseId: string;

  @ApiProperty()
  @IsString()
  studentSubId: string;
}
