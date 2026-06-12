import { Currencies } from 'src/common/enums/currency.enum';

export class MoneyDepositedEvent {
  constructor(
    public accountId: string,
    public amount: number,
    public currency: Currencies,
  ) {}
}
