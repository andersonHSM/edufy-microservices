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
}
