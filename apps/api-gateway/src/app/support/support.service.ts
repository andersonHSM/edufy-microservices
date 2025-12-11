import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateTicketDto } from "./presentation/dtos/create-ticket.dto";
import { ReplyTicketDto } from "./presentation/dtos/reply-ticket.dto";

export const SUPPORT_SERVICE = "SUPPORT_SERVICE";

@Injectable()
export class SupportService {
  constructor(@Inject(SUPPORT_SERVICE) private readonly client: ClientProxy) {}

  createTicket(
    createTicketDto: CreateTicketDto,
    creatorSubId: string,
    creatorName: string,
    creatorEmail: string,
  ) {
    return this.client.send("create_ticket", {
      ...createTicketDto,
      creatorSubId,
      creatorName,
      creatorEmail,
    });
  }

  listMyTickets(creatorSubId: string) {
    return this.client.send("list_my_tickets", creatorSubId);
  }

  replyTicket(
    ticketId: string,
    replyTicketDto: ReplyTicketDto,
    authorSubId: string,
    authorName: string,
  ) {
    return this.client.send("reply_ticket", {
      ticketId,
      dto: {
        ...replyTicketDto,
        authorSubId,
        authorName,
      },
    });
  }

  resolveTicket(ticketId: string, resolvedBy: string) {
    return this.client.send("resolve_ticket", {
      ticketId,
      dto: { resolvedBy },
    });
  }

  getTicketById(ticketId: string) {
    return this.client.send("get_ticket_by_id", ticketId);
  }
}
