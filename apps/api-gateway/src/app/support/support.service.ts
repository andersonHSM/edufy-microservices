import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ReplyTicketDto } from "src/app/support/presentation/dtos/reply-ticket.dto";
import { UserEntity } from "src/app/users/domain/user.entity";
import { USERS_TCP_SERVICE } from "src/app/users/users.constants";
import { CreateTicketDto } from "./presentation/dtos/create-ticket.dto";
import {
  TicketMessageResponseDto,
  TicketResponseDto,
} from "./presentation/dtos/ticket-response.dto";

export const SUPPORT_SERVICE = "SUPPORT_SERVICE";

@Injectable()
export class SupportService {
  constructor(
    @Inject(SUPPORT_SERVICE) private readonly client: ClientProxy,
    @Inject(USERS_TCP_SERVICE) private readonly usersClient: ClientProxy,
  ) {}

  async createTicket(
    createTicketDto: CreateTicketDto,
    creatorSubId: string,
  ): Promise<TicketResponseDto> {
    const user: UserEntity = await this._fetchUserDetails(creatorSubId);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return firstValueFrom(
      this.client.send<TicketResponseDto>("create_ticket", {
        ...createTicketDto,
        creatorSubId: user.sub_id,
        creatorName: `${user.firstName} ${user.lastName}`,
        creatorEmail: user.email,
      }),
    );
  }

  async listMyTickets(userSub: string): Promise<TicketResponseDto[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return firstValueFrom(
      this.client.send<TicketResponseDto[]>("list_my_tickets", userSub),
    );
  }

  async replyTicket(
    ticketId: string,
    replyTicketDto: ReplyTicketDto,
    authorSubId: string,
  ): Promise<TicketMessageResponseDto> {
    const user: UserEntity = await this._fetchUserDetails(authorSubId);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return firstValueFrom(
      this.client.send<TicketMessageResponseDto>("reply_ticket", {
        ticketId,
        dto: {
          ...replyTicketDto,
          authorSubId: user.sub_id,
          authorName: `${user.firstName} ${user.lastName}`,
        },
      }),
    );
  }

  resolveTicket(
    ticketId: string,
    resolvedBy: string,
  ): Promise<TicketResponseDto> {
    return firstValueFrom(
      this.client.send<TicketResponseDto>("resolve_ticket", {
        ticketId,
        dto: { resolvedBy },
      }),
    );
  }

  getTicketById(ticketId: string): Promise<TicketResponseDto> {
    return firstValueFrom(
      this.client.send<TicketResponseDto>("get_ticket_by_id", ticketId),
    );
  }

  private async _fetchUserDetails(userSubId: string): Promise<UserEntity> {
    return firstValueFrom(
      this.usersClient.send<UserEntity>("getUserById", userSubId),
    );
  }
}
