import { Inject, Injectable } from '@nestjs/common';
import { ISupportRepository } from 'app/support/domain/support.repository';
import {
  TicketMessageEntity,
  TicketMessageProps,
} from 'app/support/domain/ticket-message.entity';
import {
  CreateTicketInput,
  TicketEntity,
  TicketStatus,
} from 'app/support/domain/ticket.entity';
import { Kysely } from 'kysely';
import { DATABASE } from 'libs/database/constants';
import { DB, TicketTable } from 'libs/database/kysely-support/db';
import { KyselyRepository } from 'libs/database/kysely.repository';

@Injectable()
export class KyselySupportRepository
  extends KyselyRepository
  implements ISupportRepository
{
  constructor(
    @Inject(DATABASE) protected override readonly database: Kysely<DB>,
  ) {
    super(database);
  }

  async createTicket(data: CreateTicketInput): Promise<TicketEntity> {
    const ticket = TicketEntity.create(data);
    const createdTicket = await this.database
      .insertInto('support.tickets')
      .values(ticket.toPersistence())
      .returningAll()
      .executeTakeFirstOrThrow();
    return TicketEntity.fromProps(createdTicket as TicketTable);
  }

  async createTicketMessage(
    data: Omit<TicketMessageProps, 'createdAt'>,
  ): Promise<TicketMessageEntity> {
    const message = TicketMessageEntity.create(data);
    const createdMessage = await this.database
      .insertInto('support.ticket_messages')
      .values(message.toPersistence())
      .returningAll()
      .executeTakeFirstOrThrow();
    return TicketMessageEntity.fromProps(createdMessage);
  }

  async listMyTickets(creatorSubId: string): Promise<TicketEntity[]> {
    const tickets = await this.database
      .selectFrom('support.tickets')
      .selectAll()
      .where('creatorSubId', '=', creatorSubId)
      .execute();
    return tickets.map((ticket) => TicketEntity.fromProps(ticket));
  }

  async findTicketById(id: string): Promise<TicketEntity | null> {
    const ticket = await this.database
      .selectFrom('support.tickets')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    return ticket ? TicketEntity.fromProps(ticket) : null;
  }

  async updateTicketStatus(
    id: string,
    status: TicketStatus,
    resolvedBy?: string | null,
  ): Promise<void> {
    const updatePayload: {
      status: TicketStatus;
      resolvedBy?: string | null;
      updatedAt: Date;
    } = {
      status,
      updatedAt: new Date(),
    };
    if (resolvedBy !== undefined) {
      updatePayload.resolvedBy = resolvedBy;
    }
    await this.database
      .updateTable('support.tickets')
      .set(updatePayload)
      .where('id', '=', id)
      .execute();
  }

  async listTicketMessages(ticketId: string): Promise<TicketMessageEntity[]> {
    const messages = await this.database
      .selectFrom('support.ticket_messages')
      .selectAll()
      .where('ticketId', '=', ticketId)
      .orderBy('createdAt', 'asc')
      .execute();
    return messages.map((message) => TicketMessageEntity.fromProps(message));
  }

  async updateTicketCreatorDetails(
    creatorSubId: string,
    creatorName: string,
    creatorEmail: string,
  ): Promise<void> {
    await this.database
      .updateTable('support.tickets')
      .set({ creatorName, creatorEmail, updatedAt: new Date() })
      .where('creatorSubId', '=', creatorSubId)
      .where('status', '=', TicketStatus.OPEN) // Only update open tickets
      .execute();
  }
}
