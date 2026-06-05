export class CustomerChangeEmailEvent {
  constructor(
    public customerId: string,
    public newEmail: string,
    public accordsAt = new Date(),
  ) {}
}
