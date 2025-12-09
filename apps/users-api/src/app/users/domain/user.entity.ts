export class UserEntity {
  sub_id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  biography?: string;
  interests?: string[];
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  static create(data: Omit<UserEntity, 'createdAt' | 'updatedAt'>): UserEntity {
    const user = new UserEntity();
    Object.assign(user, data);
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return user;
  }
}
