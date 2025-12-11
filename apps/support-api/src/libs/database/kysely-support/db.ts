import type { TicketStatus } from 'app/support/domain/ticket.entity';

export interface TicketTable {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  creatorSubId: string;
  creatorName: string;
  creatorEmail: string;
  resolvedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketMessageTable {
  id: string;
  ticketId: string;
  content: string;
  authorSubId: string;
  authorName: string;
  createdAt: Date;
}

export interface DB {
  'support.tickets': TicketTable;
  'support.ticket_messages': TicketMessageTable;
}
