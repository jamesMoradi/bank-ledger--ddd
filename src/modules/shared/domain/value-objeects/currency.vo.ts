import { Currencies } from 'src/common/enums/currency.enum';

export class Currency {
  private readonly _code: Currencies;

  constructor(code: Currencies) {
    this._code = code;
  }

  static of(code: Currencies): Currency {
    if (![Currencies.EUR, Currencies.USD].includes(code)) {
      throw new Error(`${code} is Unsupported currency`);
    }
    return new Currency(code);
  }

  get code() {
    return this._code;
  }

  equals = (currency: Currencies) => this._code === currency;

  toString = () => this._code;
}
