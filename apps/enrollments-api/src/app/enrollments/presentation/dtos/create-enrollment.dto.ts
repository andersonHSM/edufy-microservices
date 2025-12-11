import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsString()
  studentSubId: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  status: 'pending' | 'completed' | 'failed';
}
