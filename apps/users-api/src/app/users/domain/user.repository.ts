import { UserEntity } from 'src/app/users/domain/user.entity';

export const UserRepository = Symbol('UserRepository');

export interface IUserRepository {
  save(user: UserEntity): Promise<void>;
  findOneByEmail(email: string): Promise<UserEntity | null>;
}
