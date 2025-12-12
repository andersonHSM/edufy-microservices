import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  creatorSubId: string;

  @IsString()
  @IsNotEmpty()
  creatorName: string;

  @IsString()
  @IsNotEmpty()
  creatorEmail: string;
}
