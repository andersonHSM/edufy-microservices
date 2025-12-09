import {Controller} from "@nestjs/common";
import {EventPattern, Payload} from "@nestjs/microservices";
import {UsersService} from "src/app/users/application/users.service";
import {UserSignedUpEvent} from "src/app/users/events/user-signed-up.event";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @EventPattern('user_signed_up')
  handleUserSignedUp(@Payload() data: UserSignedUpEvent) {
    return this.usersService.createUser(data);
  }
}
