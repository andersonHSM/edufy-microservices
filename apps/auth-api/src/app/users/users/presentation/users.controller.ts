import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {SignupUserDto} from "src/app/users/users/presentation/dto/signup-user.dto";
import {UsersService} from 'src/app/users/users/users.service';


@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) {
	}

	@MessagePattern('createUser')
	create(@Payload() signupUserDto: SignupUserDto) {
		return this.usersService.create(signupUserDto);
	}


}
