export class CustomerUpdateFullNameCommand {
  constructor(
    public readonly fullName: string,
    public readonly id: string,
  ) {}
}
