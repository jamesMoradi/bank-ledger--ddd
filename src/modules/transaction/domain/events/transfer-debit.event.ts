export class TransferDebitedEvent {
  constructor(
    public senderAccountId: string,
    public receiverAccountId: string,
    public amount: number,
    public currency: string,
  ) {}
}
