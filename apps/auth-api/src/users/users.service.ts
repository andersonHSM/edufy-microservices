import {Injectable} from '@nestjs/common';

@Injectable()
export class UsersService {

	public async createUser() {
		return Promise.resolve('Usuário Criado com Sucesso')
	}
}
