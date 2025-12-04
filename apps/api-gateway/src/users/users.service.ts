import {Inject, Injectable} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {SignupUserDto} from "./presentation/dto/signup-user.dto";

@Injectable()
export class UsersService {

	constructor(@Inject('AUTH_API_SERVICE') private readonly authClientProxy: ClientProxy ) {
	}

	public async createUser(body: SignupUserDto) {
		return this.authClientProxy.send('createUser', body);
	}
}
