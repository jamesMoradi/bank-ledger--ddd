export class TransferInitiatedEvent {
  constructor(
    public senderCustomerId: string,
    public receiverCustomerId: string,
    public amount: number,
    public currency: string,
  ) {}
}
