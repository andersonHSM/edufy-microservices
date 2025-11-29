import {Injectable} from '@nestjs/common';
import {SignupUserDto} from "src/app/users/users/presentation/dto/signup-user.dto";

@Injectable()
export class UsersService {
	create(signupUserDto: SignupUserDto) {
		return 'This action adds a new user';
	}

}
