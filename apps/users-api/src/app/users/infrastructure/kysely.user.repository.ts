import { Injectable } from '@nestjs/common';
import { Selectable } from 'kysely';
import { UsersUsers } from 'src/libs/database/generated/db';
import { KyselyRepository } from 'src/libs/database/kysely.repository';
import { UserEntity } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository';
import { UserRoleEnum } from '../domain/user.role';

@Injectable()
export class KyselyUserRepository
  extends KyselyRepository
  implements IUserRepository
{
  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.database
      .selectFrom('users.users')
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
      .selectFrom('users.users')
      .selectAll()
      .where('users.users.subId', '=', id)
      .$narrowType<{
        role: UserRoleEnum;
      }>()
      .executeTakeFirst()
      .then((userInDb) => this.mapToUserEntity(userInDb));
  }

  async save(user: UserEntity): Promise<void> {
    await this.database
      .insertInto('users.users')
      .values({
        subId: user.sub_id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        interests: JSON.stringify(user.interests as string[]),
      })
      .onConflict((oc) =>
        oc.column('subId').doUpdateSet({
          role: user.role,
          email: user.email,
          biography: user.biography,
          interests: JSON.stringify(user.interests as string[]),
          updatedAt: new Date(),
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      )
      .execute();
  }

  private mapToUserEntity(userInDb?: Selectable<UsersUsers>) {
    if (!userInDb) {
      return null;
    }
    return UserEntity.fromProps(userInDb);
  }
}
