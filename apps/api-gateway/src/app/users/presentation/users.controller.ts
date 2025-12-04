import {Body, Controller, Post} from '@nestjs/common';
import {SignupUserDto} from "src/app/users/presentation/dto/signup-user.dto";
import {UsersService} from 'src/app/users/users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {
	}

	@Post("")
	public async createUser(@Body() body: SignupUserDto) {
		return this.usersService.createUser(body);
	}
}
