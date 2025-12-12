import {
  TicketMessageEntity,
  TicketMessageProps,
} from './ticket-message.entity';
import { CreateTicketInput, TicketEntity, TicketStatus } from './ticket.entity';

export const SupportRepository = Symbol('SupportRepository');

export interface ISupportRepository {
  createTicket(data: CreateTicketInput): Promise<TicketEntity>;
  createTicketMessage(
    data: Omit<TicketMessageProps, 'createdAt'>,
  ): Promise<TicketMessageEntity>;
  listMyTickets(creatorSubId: string): Promise<TicketEntity[]>;
  findTicketById(id: string): Promise<TicketEntity | null>;
  updateTicketStatus(
    id: string,
    status: TicketStatus,
    resolvedBy?: string,
  ): Promise<void>;
  listTicketMessages(ticketId: string): Promise<TicketMessageEntity[]>;
  updateTicketCreatorDetails(
    creatorSubId: string,
    creatorName: string,
    creatorEmail: string,
  ): Promise<void>;
}
