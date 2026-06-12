export class TransferFailedEvent {
  constructor(
    public senderAccountId: string,
    public receiverAccountId: string,
    public amount: number,
    public currency: string,
  ) {}
}
