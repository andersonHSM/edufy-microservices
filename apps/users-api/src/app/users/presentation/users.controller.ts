import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UsersService } from 'src/app/users/application/users.service';
import { UserSignedUpEvent } from 'src/app/users/events/user-signed-up.event';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('getUserById')
  public async getUserById(subId: string) {
    return this.usersService.getUserById(subId);
  }

  @EventPattern('user_signed_up')
  public async handleUserSignedUp(
    @Payload() payload: UserSignedUpEvent,
    @Ctx() context: RmqContext,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.usersService.createUser(payload);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      channel.ack(originalMsg);
      this.logger.log(`Acknoledged message for user: ${payload.email}`);
    } catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to process message for user: ${payload.email}. Sending to DLQ. Error: ${error.message}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      channel.nack(originalMsg, false, false);
    }
  }
}
