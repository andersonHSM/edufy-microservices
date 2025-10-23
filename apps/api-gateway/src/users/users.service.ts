import {Inject, Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {SignupUserDto} from "./presentation/dto/signup-user.dto";

@Injectable()
export class UsersService implements OnApplicationBootstrap{
	constructor(@Inject("AUTH_SERVICE_CLIENT") private readonly usersServiceClient: ClientProxy) {
	}

	async onApplicationBootstrap() {
        await this.usersServiceClient.connect();
    }

	public async createUser(body: SignupUserDto) {
		return this.usersServiceClient.send("users.create", body);
	}
}
