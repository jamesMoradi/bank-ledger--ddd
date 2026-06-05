export class CustomerRegisteredEvent {
  constructor(
    public readonly customerId: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
