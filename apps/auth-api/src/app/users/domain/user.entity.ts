import { randomUUID, UUID } from 'node:crypto';
import { UserRoleEnum } from './user.role';

export interface CreateUserInput {
  email: string;
  password: string;
  role?: UserRoleEnum | null;
  sub?: UUID;
}

export interface UserProps {
  id: string;
  email: string;
  password: string;
  role: UserRoleEnum | null;
}

export class UserEntity {
  public static create(input: CreateUserInput): UserEntity {
    return new UserEntity(
      input.sub ?? randomUUID(),
      input.email,
      input.password,
      input.role ?? null,
    );
  }

  public static fromProps(props: UserProps): UserEntity {
    return new UserEntity(
      props.id as UUID,
      props.email,
      props.password,
      props.role,
    );
  }

  private constructor(
    public readonly sub: UUID,
    public readonly email: string,
    public readonly password: string,
    public role: UserRoleEnum | null = null,
  ) {}
}
