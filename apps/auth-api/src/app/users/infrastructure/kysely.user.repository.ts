import {Injectable} from '@nestjs/common';
import {Selectable} from 'kysely';
import {AuthUsers} from "src/libs/database/generated/db";
import {KyselyRepository} from "src/libs/database/kysely.repository";
import {UserEntity} from '../domain/user.entity';
import {IUserRepository} from '../domain/user.repository';
import {UserRoleEnum} from '../domain/user.role';

@Injectable()
export class KyselyUserRepository
	extends KyselyRepository
	implements IUserRepository {
	async findOneByEmail(email: string): Promise<UserEntity | null> {
		return await this.database
			.selectFrom('auth.users')
			.selectAll()
			.where('email', '=', email)
			.$narrowType<{
				role: UserRoleEnum;
			}>()
			.executeTakeFirst()
			.then((userInDb) => this.mapToUserEntity(userInDb));
	}

	async findOneById(id: string): Promise<UserEntity | null> {
		return await this.database
			.selectFrom('auth.users')
			.selectAll()
			.where('auth.users.sub', '=', id)
			.$narrowType<{
				role: UserRoleEnum;
			}>()
			.executeTakeFirst()
			.then((userInDb) => this.mapToUserEntity(userInDb));
	}

	async save(user: UserEntity): Promise<void> {
		await this.database
			.insertInto('auth.users')
			.values({
				sub: user.sub,
				email: user.email,
				password: user.password,
				role: user.role,
			})
			.onConflict((oc) =>
				oc.column('sub').doUpdateSet({
					password: user.password,
					role: user.role,
					updatedAt: new Date(),
				}),
			)
			.execute();
	}

	private mapToUserEntity(userInDb?: Selectable<AuthUsers>) {
		if (!userInDb) {
			return null;
		}
		return UserEntity.fromProps({
			id: userInDb.sub,
			email: userInDb.email,
			password: userInDb.password,
			role: userInDb.role as UserRoleEnum,
		});
	}
}
