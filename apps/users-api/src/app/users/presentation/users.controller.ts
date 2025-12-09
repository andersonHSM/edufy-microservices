import {Controller} from "@nestjs/common";
import {UsersService} from "src/app/users/application/users.service";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
