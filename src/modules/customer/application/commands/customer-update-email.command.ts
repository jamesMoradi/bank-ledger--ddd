export class CustomerUpdateEmailCommand {
  constructor(
    public readonly email: string,
    public readonly id: string,
  ) {}
}
