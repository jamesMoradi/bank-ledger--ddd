export class AccountOpenedEvent {
  constructor(
    public customerId: string,
    public iban: string,
  ) {}
}
