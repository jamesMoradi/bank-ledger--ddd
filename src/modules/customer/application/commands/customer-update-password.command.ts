export class CustomerUpdatePasswordCommand {
  constructor(
    public readonly password: string,
    public readonly id: string,
  ) {}
}
