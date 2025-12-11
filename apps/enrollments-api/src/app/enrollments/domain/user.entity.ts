import { UUID } from 'node:crypto';

export type UserProps = {
  id: UUID;
  firstName: string;
  lastName: string;
};

export class UserEntity {
  public static fromProps(props: UserProps): UserEntity {
    return new UserEntity(props.id, props.firstName, props.lastName);
  }

  private constructor(
    public readonly id: UUID,
    public readonly firstName: string,
    public readonly lastName: string,
  ) {}
}
