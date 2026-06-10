import { TransactionType } from '../../shared/enums/transaction-type.enum';

export class GetByAccountIdAndTypeCommand {
  constructor(
    public accountId: string,
    public type: TransactionType,
    public since: Date,
  ) {}
}
