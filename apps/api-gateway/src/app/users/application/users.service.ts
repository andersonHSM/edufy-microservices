import {Inject, Injectable} from '@nestjs/common';
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {catchError, throwError, timeout} from "rxjs";
import {SignupUserDto} from "src/app/users/presentation/dto/signup-user.dto";

@Injectable()
export class UsersService {

	constructor(@Inject('AUTH_API_SERVICE') private readonly authClientProxy: ClientProxy) {
	}

	public async createUser(body: SignupUserDto) {
		return this.authClientProxy.send('createUser', body).pipe(
			timeout(5000),
			catchError(err => {
				return throwError(() => new RpcException(err))
			})
		);
	}
}
