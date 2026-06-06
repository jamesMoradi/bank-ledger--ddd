import { AccountStatus } from '../../shared/enums/account-status.enum';

export class AccountChangeStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: AccountStatus,
  ) {}
}
