import { Currencies } from 'src/common/enums/currency.enum';

export class TransferCommand {
  constructor(
    public accountId: string,
    public amount: number,
    public currency: Currencies,
    public receiverAccountId: string,
  ) {}
}
