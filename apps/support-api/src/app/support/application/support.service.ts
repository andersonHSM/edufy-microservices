import { Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  type ISupportRepository,
  SupportRepository,
} from 'app/support/domain/support.repository';
import { TicketMessageEntity } from 'app/support/domain/ticket-message.entity';
import { TicketEntity, TicketStatus } from 'app/support/domain/ticket.entity';
import { CreateTicketDto } from '../presentation/dtos/create-ticket.dto';
import { ReplyTicketDto } from '../presentation/dtos/reply-ticket.dto';

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(
    @Inject(SupportRepository)
    private readonly supportRepository: ISupportRepository,
  ) {}

  async createTicket(dto: CreateTicketDto): Promise<TicketEntity> {
    this.logger.log(`Creating ticket for user ${dto.creatorSubId}`);
    return this.supportRepository.createTicket(dto);
  }

  async listMyTickets(creatorSubId: string): Promise<TicketEntity[]> {
    this.logger.log(`Listing tickets for user ${creatorSubId}`);
    return this.supportRepository.listMyTickets(creatorSubId);
  }

  async getTicketById(id: string): Promise<TicketEntity> {
    this.logger.log(`Fetching ticket with ID ${id}`);
    const ticket = await this.supportRepository.findTicketById(id);
    if (!ticket) {
      throw new RpcException({ message: 'Ticket not found', status: 404 });
    }
    return ticket;
  }

  async replyTicket(
    ticketId: string,
    dto: ReplyTicketDto,
  ): Promise<TicketMessageEntity> {
    this.logger.log(
      `Replying to ticket ${ticketId} by user ${dto.authorSubId}`,
    );
    const ticket = await this.supportRepository.findTicketById(ticketId);
    if (!ticket) {
      throw new RpcException({ message: 'Ticket not found', status: 404 });
    }
    if (
      ticket.status === TicketStatus.RESOLVED ||
      ticket.status === TicketStatus.CLOSED
    ) {
      throw new RpcException({
        message: 'Cannot reply to a resolved or closed ticket',
        status: 400,
      });
    }
    return this.supportRepository.createTicketMessage({ ...dto, ticketId });
  }

  async resolveTicket(id: string, resolvedBy: string): Promise<void> {
    this.logger.log(`Resolving ticket ${id} by ${resolvedBy}`);
    const ticket = await this.supportRepository.findTicketById(id);
    if (!ticket) {
      throw new RpcException({ message: 'Ticket not found', status: 404 });
    }
    if (ticket.status === TicketStatus.RESOLVED) {
      throw new RpcException({
        message: 'Ticket already resolved',
        status: 400,
      });
    }
    await this.supportRepository.updateTicketStatus(
      id,
      TicketStatus.RESOLVED,
      resolvedBy,
    );
  }

  async updateTicketCreatorDetails(
    creatorSubId: string,
    creatorName: string,
    creatorEmail: string,
  ): Promise<void> {
    this.logger.log(
      `Updating creator details for tickets of user ${creatorSubId}`,
    );
    await this.supportRepository.updateTicketCreatorDetails(
      creatorSubId,
      creatorName,
      creatorEmail,
    );
  }
}
