export class CustomerChangePasswordEvent {
  constructor(
    public customerId: string,
    public accordsAt = new Date(),
  ) {}
}
