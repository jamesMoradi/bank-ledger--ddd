export class TransactionFailedEvent {
  constructor(
    public customerId: string,
    public amount: number,
    public currency: string,
  ) {}
}
