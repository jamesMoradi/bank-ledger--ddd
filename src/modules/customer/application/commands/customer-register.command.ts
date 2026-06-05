export class CustomerRegisterCommand {
  constructor(
    public email: string,
    public nationalId: string,
    public fullName: string,
    public password: string,
  ) {}
}
