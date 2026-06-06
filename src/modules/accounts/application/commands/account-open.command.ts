import { Currencies } from 'src/common/enums/currency.enum';

export class AccountOpenCommand {
  constructor(
    public readonly customerId: string,
    public readonly currency: Currencies,
  ) {}
}
