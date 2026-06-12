export class FraudResolvedEvent {
  constructor(
    public readonly fraudId: string,
    public readonly accountId: string,
    public readonly customerId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
