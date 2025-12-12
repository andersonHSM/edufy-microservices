import { Expose, Type } from 'class-transformer';
import { TicketMessageEntity } from '../../domain/ticket-message.entity';
import { TicketEntity, TicketStatus } from '../../domain/ticket.entity';

export class TicketMessageResponseDto {
  static fromEntity(entity: TicketMessageEntity): TicketMessageResponseDto {
    const dto = new TicketMessageResponseDto();
    dto.id = entity.id;
    dto.ticketId = entity.ticketId;
    dto.content = entity.content;
    dto.authorSubId = entity.authorSubId;
    dto.authorName = entity.authorName;
    dto.createdAt = entity.createdAt; // Accessing prop via getter usually works if defined on entity
    return dto;
  }

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

export class TicketResponseDto {
  static fromEntity(entity: TicketEntity): TicketResponseDto {
    const dto = new TicketResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.status = entity.status;
    dto.creatorSubId = entity.creatorSubId;
    dto.creatorName = entity.creatorName;
    dto.creatorEmail = entity.creatorEmail;
    dto.resolvedBy = entity.resolvedBy || undefined;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.messages = entity.messages.map((msg) =>
      TicketMessageResponseDto.fromEntity(msg),
    );
    return dto;
  }

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
  @Expose()
  @Type(() => TicketMessageResponseDto)
  messages: TicketMessageResponseDto[];
}
