import { IsString } from "class-validator";

export class CreateEnrollmentDto {
  @IsString()
  course_id: string;
}
