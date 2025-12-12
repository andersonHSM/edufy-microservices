import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ReplyTicketDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsNotEmpty()
  authorSubId: string;

  @IsString()
  @IsNotEmpty()
  authorName: string;
}
