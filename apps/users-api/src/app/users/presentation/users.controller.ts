import {Controller, Logger} from "@nestjs/common";
import {Ctx, EventPattern, Payload, RmqContext} from "@nestjs/microservices";
import {UsersService} from "src/app/users/application/users.service";
import {UserSignedUpEvent} from "src/app/users/events/user-signed-up.event";

@Controller()
export class UsersController {
	private readonly logger = new Logger(UsersController.name);

	constructor(private readonly usersService: UsersService) {
	}

	@EventPattern('user_signed_up')
	async handleUserSignedUp(@Payload() data: UserSignedUpEvent, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const originalMsg = context.getMessage();

		try {
			await this.usersService.createUser(data);
			channel.ack(originalMsg);
			this.logger.log(`Acknowledged message for user: ${data.email}`);
		} catch (error) {
			this.logger.error(`Failed to process message for user: ${data.email}. Sending to DLQ. Error: ${error.message}`);
			channel.nack(originalMsg, false, false); // Reject and send to DLQ
		}
	}
}
