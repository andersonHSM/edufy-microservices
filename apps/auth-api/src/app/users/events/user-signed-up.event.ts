export class UserSignedUpEvent {
  constructor(
    public readonly sub_id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role?: string,
    public readonly biography?: string,
    public readonly interests?: string[],
    public readonly profilePictureUrl?: string,
  ) {}
}
