export class FindSumWithdrawalsByAccountIdSinceCommand {
  constructor(
    public accountId: string,
    public since: Date,
  ) {}
}
