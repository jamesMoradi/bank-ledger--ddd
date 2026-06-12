// import { FraudRules } from '../../shared/enums/fraud-rules.enum';

export class WithdrawFraudEvent {
  constructor(
    public accountId: string,
    public id: string,
    public amount: number,
  ) {}
}
