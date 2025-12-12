export class UserRoleAssignedEvent {
  constructor(
    public readonly sub_id: string,
    public readonly role: string,
  ) {}
}
