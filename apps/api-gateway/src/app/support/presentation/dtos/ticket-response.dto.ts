import { ApiProperty } from "@nestjs/swagger";

export enum TicketStatus {
  OPEN = "open",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export class TicketMessageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ name: "ticket_id" })
  ticketId: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ name: "author_sub_id" })
  authorSubId: string;

  @ApiProperty({ name: "author_name" })
  authorName: string;

  @ApiProperty({ name: "created_at" })
  createdAt: Date;
}

export class TicketResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: TicketStatus })
  status: TicketStatus;

  @ApiProperty({ name: "creator_sub_id" })
  creatorSubId: string;

  @ApiProperty({ name: "creator_name" })
  creatorName: string;

  @ApiProperty({ name: "creator_email" })
  creatorEmail: string;

  @ApiProperty({ name: "resolved_by", required: false })
  resolvedBy?: string;

  @ApiProperty({ name: "created_at" })
  createdAt: Date;

  @ApiProperty({ name: "updated_at" })
  updatedAt: Date;

  @ApiProperty({ type: [TicketMessageResponseDto] })
  messages: TicketMessageResponseDto[];
}
