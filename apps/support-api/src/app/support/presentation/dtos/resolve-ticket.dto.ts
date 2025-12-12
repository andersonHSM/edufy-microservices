import { IsNotEmpty, IsUUID } from 'class-validator';

export class ResolveTicketDto {
  @IsUUID()
  @IsNotEmpty()
  resolvedBy: string;
}
