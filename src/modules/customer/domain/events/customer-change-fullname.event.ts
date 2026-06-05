export class CustomerChangeFullNameEvent {
  constructor(
    public customerId: string,
    public fullName: string,
    public accordsAt = new Date(),
  ) {}
}
