import {Injectable} from '@nestjs/common';
import {SignupUserDto} from "./presentation/dto/signup-user.dto";

@Injectable()
export class UsersService {

	public async createUser(body: SignupUserDto) {
	}
}
