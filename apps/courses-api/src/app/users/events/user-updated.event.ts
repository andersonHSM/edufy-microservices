export class UserUpdatedEvent {
  constructor(
    public readonly sub_id: string,
    public readonly name: string,
    public readonly profilePictureUrl?: string,
  ) {}
}
