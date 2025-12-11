import { UUID } from 'node:crypto';

export type UserProps = {
  id: UUID;
  name: string;
};

export class UserEntity {
  public static fromProps(props: UserProps): UserEntity {
    return new UserEntity(props.id, props.name);
  }

  private constructor(
    public readonly id: UUID,
    public readonly name: string,
  ) {}
}
