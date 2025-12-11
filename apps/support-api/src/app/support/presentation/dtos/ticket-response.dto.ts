import { Expose } from 'class-transformer';
import { TicketStatus } from '../../domain/ticket.entity';

export class TicketResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: TicketStatus;

  @Expose({ name: 'creator_sub_id' })
  creatorSubId: string;

  @Expose({ name: 'creator_name' })
  creatorName: string;

  @Expose({ name: 'creator_email' })
  creatorEmail: string;

  @Expose({ name: 'resolved_by' })
  resolvedBy?: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
