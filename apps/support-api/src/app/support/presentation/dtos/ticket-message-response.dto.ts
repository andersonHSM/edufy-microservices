import { Expose } from 'class-transformer';

export class TicketMessageResponseDto {
  @Expose()
  id: string;

  @Expose({ name: 'ticket_id' })
  ticketId: string;

  @Expose()
  content: string;

  @Expose({ name: 'author_sub_id' })
  authorSubId: string;

  @Expose({ name: 'author_name' })
  authorName: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;
}
