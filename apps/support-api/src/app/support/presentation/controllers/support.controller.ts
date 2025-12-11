import { Controller, UseFilters } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SupportService } from 'app/support/application/support.service';
import { ExceptionFilter } from 'libs/filters/rpc-exception.filter';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import { ReplyTicketDto } from '../dtos/reply-ticket.dto';
import { ResolveTicketDto } from '../dtos/resolve-ticket.dto';

@UseFilters(new ExceptionFilter())
@Controller()
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @MessagePattern('create_ticket')
  async createTicket(@Payload() data: CreateTicketDto) {
    return this.supportService.createTicket(data);
  }

  @MessagePattern('list_my_tickets')
  async listMyTickets(@Payload() creatorSubId: string) {
    return this.supportService.listMyTickets(creatorSubId);
  }

  @MessagePattern('reply_ticket')
  async replyTicket(
    @Payload() data: { ticketId: string; dto: ReplyTicketDto },
  ) {
    return this.supportService.replyTicket(data.ticketId, data.dto);
  }

  @MessagePattern('resolve_ticket')
  async resolveTicket(
    @Payload() data: { ticketId: string; dto: ResolveTicketDto },
  ) {
    return this.supportService.resolveTicket(
      data.ticketId,
      data.dto.resolvedBy,
    );
  }

  @MessagePattern('get_ticket_by_id')
  async getTicketById(@Payload() id: string) {
    return this.supportService.getTicketById(id);
  }

  @MessagePattern('user_updated')
  async userUpdated(
    @Payload() data: { user_sub_id: string; name: string; email: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.supportService.updateTicketCreatorDetails(
        data.user_sub_id,
        data.name,
        data.email,
      );
      channel.ack(originalMsg);
    } catch (error) {
      console.error(
        'Failed to process user_updated event in support-api:',
        error,
      );
      channel.nack(originalMsg, false, false);
    }
  }
}
