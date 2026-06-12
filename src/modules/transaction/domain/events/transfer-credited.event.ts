export class TransferCreditedEvent {
  constructor(
    public senderAccountId: string,
    public receiverAccountId: string,
    public amount: string,
    public currency: string,
  ) {}
}
