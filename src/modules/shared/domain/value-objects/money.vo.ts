import { Currencies } from 'src/common/enums/currency.enum';
import { Currency } from './currency.vo';
import { BadRequestError } from '../errors/bad-request.error';
import { isNumber } from 'class-validator';
import { CurrencyNotMatchError } from 'src/modules/transaction/domain/errors/currency-not-match.error';
import { AmountNotEnoughError } from 'src/modules/transaction/domain/errors/amount-not-enough.error';

export class Money {
  private readonly _amount: number;
  private readonly _currency: Currency;

  private constructor(amount: number, currency: Currency) {
    this._amount = amount;
    this._currency = currency;
  }

  static of(amount: number, currency: Currencies): Money {
    const cur = Currency.of(currency);
    if (isNaN(amount) || !isNumber(amount))
      throw new BadRequestError('amount must be a valid number');

    if (amount < 0) throw new BadRequestError('amount can not be negative');

    return new Money(amount, cur);
  }

  get amount() {
    return this._amount;
  }

  get currency() {
    return this._currency;
  }

  add(money: Money) {
    this.assertSameCurrency(money);
    return Money.of(money.amount + this._amount, money.currency.code);
  }

  decrease(money: Money) {
    this.assertSameCurrency(money);
    this.assertDecreaseAmount(money);
    return Money.of(this._amount - money.amount, money.currency.code);
  }

  isEquals = (amount: number) => this._amount === amount;

  isLessThan = (amount: number) => this._amount < amount;

  isGreaterThan = (amount: number) => this._amount > amount;

  isZero = () => this._amount === 0;

  private assertDecreaseAmount(other: Money) {
    if (other.amount > this._amount)
      throw new AmountNotEnoughError(
        'account balance is not enough for this transaction',
      );
  }

  private assertSameCurrency(other: Money): void {
    if (!this._currency.equals(other._currency.toString())) {
      throw new CurrencyNotMatchError(
        'currencies for transaction is not match',
      );
    }
  }

  toString(): string {
    return `${this._amount.toFixed(2)} ${this._currency.toString()}`;
  }

  toJSON(): { amount: number; currency: string } {
    return {
      amount: this._amount,
      currency: this._currency.code,
    };
  }
}
