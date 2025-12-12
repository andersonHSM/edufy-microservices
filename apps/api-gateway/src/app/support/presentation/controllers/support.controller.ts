import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SupportService } from "src/app/support/support.service";
import { CurrentUser } from "src/app/users/presentation/current-user.decorator";
import { JwtGuard } from "src/app/users/presentation/jwt.guard";
import { RpcToHttpExceptionFilter } from "src/libs/exception-filters/rpc-to-http.exception-filter";
import { CreateTicketDto } from "../dtos/create-ticket.dto";
import { ReplyTicketDto } from "../dtos/reply-ticket.dto";

@ApiTags("support")
@Controller("support/tickets")
@UseGuards(JwtGuard)
@UseFilters(new RpcToHttpExceptionFilter())
@ApiBearerAuth()
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  createTicket(
    @Body() createTicketDto: CreateTicketDto,
    @CurrentUser() userSub: string,
  ) {
    return this.supportService.createTicket(createTicketDto, userSub);
  }

  @Get()
  listMyTickets(@CurrentUser() userSub: string) {
    return this.supportService.listMyTickets(userSub);
  }

  @Get(":id")
  getTicketById(@Param("id") ticketId: string) {
    return this.supportService.getTicketById(ticketId);
  }

  @Post(":id/reply")
  replyTicket(
    @Param("id") ticketId: string,
    @Body() replyTicketDto: ReplyTicketDto,
    @CurrentUser() userSub: string,
  ) {
    return this.supportService.replyTicket(ticketId, replyTicketDto, userSub);
  }

  @Post(":id/resolve")
  resolveTicket(@Param("id") ticketId: string, @CurrentUser() userSub: string) {
    return this.supportService.resolveTicket(ticketId, userSub);
  }
}
