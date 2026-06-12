import { Currencies } from 'src/common/enums/currency.enum';

export class MoneyWithdrawEvent {
  constructor(
    public accountId: string,
    public amount: number,
    public currency: Currencies,
  ) {}
}
