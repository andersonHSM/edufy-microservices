import {Body, Controller, Post} from '@nestjs/common';
import {UsersService} from 'src/app/users/application/users.service';
import {SignupUserDto} from "src/app/users/presentation/dto/signup-user.dto";
import {Public} from "src/app/users/presentation/public.decorator";

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {
	}

	@Public()
	@Post("")
	public async createUser(@Body() body: SignupUserDto) {
		return this.usersService.createUser(body);
	}
}
