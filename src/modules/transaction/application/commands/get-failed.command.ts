export class GetFailedByAccountIdCommand {
  constructor(
    public accountId: string,
    public limit: number,
  ) {}
}
