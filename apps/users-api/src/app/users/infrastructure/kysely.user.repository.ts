import {Inject, Injectable} from "@nestjs/common";
import {DB, KyselySqliteDriver} from "src/libs/database/database.module";
import {UserEntity} from "src/app/users/domain/user.entity";
import {IUserRepository} from "src/app/users/domain/user.repository";

@Injectable()
export class KyselyUserRepository implements IUserRepository {
  constructor(@Inject(KyselySqliteDriver) private readonly db: DB) {}

  async save(user: UserEntity): Promise<void> {
    await this.db.insertInto('users').values(user).execute();
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();
    return user ? Object.assign(new UserEntity(), user) : null;
  }
}
