import { PartialWithNull } from 'src/libs/types/partial-with-null.type';

export class UserEntity {
  static fromProps(props: PartialWithNull<UserEntity>): UserEntity {
    const user = new UserEntity();
    Object.assign(user, props);
    return user;
  }

  static create(data: Omit<UserEntity, 'createdAt' | 'updatedAt'>): UserEntity {
    const user = new UserEntity();
    Object.assign(user, data);
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return user;
  }

  sub_id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  biography?: string;
  interests?: string[] | unknown;
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
