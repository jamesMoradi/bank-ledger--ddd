import { Customer } from 'src/modules/customer/domain/entities/customer.entity';
import { IBAN } from '../value-objects/iban.vo';
import { Status } from '../value-objects/account-status.vo';
import { AccountStatus } from '../../shared/enums/account-status.enum';
import { Currencies } from 'src/common/enums/currency.enum';
import { Money } from 'src/modules/shared/domain/value-objects/money.vo';
import { AccountIsFreezeError } from '../errors/account-is-freeze.error';
import { AccountClosedError } from '../errors/account-is-closed.error';

export class Account {
  private _id: string | undefined;
  private _customer: Customer | undefined;
  private _iban: IBAN;
  private _money: Money;
  private _status: Status;
  private _domainEvents: object[];
  private _customerId: string;
  createdAt: Date;

  private constructor(
    id: string | undefined,
    iban: IBAN,
    status: Status,
    money: Money,
    createdAt: Date = new Date(),
    customerId: string,
    customer?: Customer,
  ) {
    this._id = id;
    this._customer = customer;
    this._iban = iban;
    this._status = status;
    this._money = money;
    this.createdAt = createdAt;
    this._customerId = customerId;
    this._domainEvents = [];
  }

  static create(props: {
    id: string | undefined;
    balance: number;
    status: AccountStatus;
    currency: Currencies;
    customer: undefined | Customer;
    customerId: string;
    iban?: IBAN | string;
    createdAt?: Date;
  }) {
    const { id, balance, status, currency, createdAt, customer, customerId } =
      props;

    let { iban } = props;

    if (!iban) iban = IBAN.generate();
    iban = typeof iban === 'string' ? IBAN.create(iban) : iban;

    return new Account(
      id,
      iban,
      Status.create(status),
      Money.of(balance, currency),
      createdAt,
      customerId,
      customer,
    );
  }

  get id() {
    return this._id as string;
  }

  get customer() {
    return this._customer as Customer;
  }

  get money() {
    return this._money;
  }

  get iban() {
    return this._iban;
  }

  get status() {
    return this._status;
  }

  get customerId() {
    return this._customerId;
  }

  isBalanceZero = () => this.money.isZero();

  assertActive(): void {
    if (this._status.is(AccountStatus.FROZEN)) {
      throw new AccountIsFreezeError(
        "can't increase or decrease balance when account is frozen",
      );
    }
    if (this._status.is(AccountStatus.CLOSED)) {
      throw new AccountClosedError(
        "can't increase or decrease balance when account is closed",
      );
    }
  }

  freeze() {
    this._status = Status.create(AccountStatus.FROZEN);
  }

  activate() {
    this._status = Status.create(AccountStatus.ACTIVE);
  }

  close() {
    this._status = Status.create(AccountStatus.CLOSED);
  }

  increaseBalance(amount: number, currency: Currencies) {
    this.assertActive();

    this._money = this.money.add(Money.of(amount, currency));
  }

  decreaseBalance(amount: number, currency: Currencies) {
    this.assertActive();
    this._money = this.money.add(Money.of(-amount, currency));
  }

  pullEvents() {
    const events = this._domainEvents;
    this._domainEvents = [];
    return events;
  }
}
