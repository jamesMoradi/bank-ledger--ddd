import { TransactionType } from 'src/modules/transaction/shared/enums/transaction-type.enum';
import { FraudRules } from '../../shared/enums/fraud-rules.enum';

export class TransactionFraudEvent {
  constructor(
    public accountId: string,
    public id: string,
    public rule: FraudRules,
    public type: TransactionType,
  ) {}
}
