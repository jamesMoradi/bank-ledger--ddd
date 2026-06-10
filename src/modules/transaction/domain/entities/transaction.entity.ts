import { Money } from 'src/modules/shared/domain/value-objects/money.vo';
import { TransactionStatus } from '../value-objects/status.vo';
import { Currencies } from 'src/common/enums/currency.enum';
import { TransactionStatus as TransactionStatusEnum } from '../../shared/enums/transaction.status-enum';
import { TransactionType } from '../../shared/enums/transaction-type.enum';

export class Transaction {
  private _id: string;
  private _accountId: string;
  private _type: TransactionType;
  private _status: TransactionStatus;
  private _money: Money;
  private _receiverAccountId?: string;

  private constructor(
    id: string,
    accountId: string,
    status: TransactionStatus,
    money: Money,
    type: TransactionType,
    receiverAccountId?: string,
  ) {
    this._id = id;
    this._accountId = accountId;
    this._money = money;
    this._status = status;
    this._type = type;
    this._receiverAccountId = receiverAccountId;
  }

  static reconstitute(props: {
    id: string;
    accountId: string;
    currency: Currencies;
    amount: number;
    status: TransactionStatusEnum;
    type: TransactionType;
    receiverAccountId?: string;
  }) {
    const { accountId, amount, currency, id, status, type, receiverAccountId } =
      props;
    return new Transaction(
      id,
      accountId,
      TransactionStatus.create(status),
      Money.of(amount, currency),
      type,
      receiverAccountId,
    );
  }

  static createDeposit(props: {
    id: string;
    accountId: string;
    currency: Currencies;
    amount: number;
  }) {
    const { accountId, amount, currency, id } = props;

    return new Transaction(
      id,
      accountId,
      TransactionStatus.create(TransactionStatusEnum.PENDING),
      Money.of(amount, currency),
      TransactionType.DEPOSIT,
    );
  }

  static createTransfer(props: {
    id: string;
    accountId: string;
    currency: Currencies;
    amount: number;
    receiverAccountId: string;
  }) {
    const { accountId, amount, currency, id, receiverAccountId } = props;
    return new Transaction(
      id,
      accountId,
      TransactionStatus.create(TransactionStatusEnum.PENDING),
      Money.of(amount, currency),
      TransactionType.TRANSFER_OUT,
      receiverAccountId,
    );
  }

  static createWithdraw(props: {
    id: string;
    accountId: string;
    currency: Currencies;
    amount: number;
  }) {
    const { accountId, amount, currency, id } = props;

    return new Transaction(
      id,
      accountId,
      TransactionStatus.create(TransactionStatusEnum.PENDING),
      Money.of(amount, currency),
      TransactionType.WITHDRAW,
    );
  }

  get id() {
    return this._id;
  }

  get receiverAccountId() {
    return this._receiverAccountId;
  }

  get money() {
    return this._money;
  }

  get status() {
    return this._status;
  }

  get type() {
    return this._type;
  }

  get accountId() {
    return this._accountId;
  }

  markAsCompleted() {
    this._status = TransactionStatus.create(TransactionStatusEnum.SUCCESSFUL);
  }

  markAsFailed() {
    this._status = TransactionStatus.create(TransactionStatusEnum.FAILED);
  }

  isWithDraw = () => this._type === TransactionType.WITHDRAW;

  isTransfer = () => this._type === TransactionType.TRANSFER_OUT;

  isDeposit = () => this._type === TransactionType.DEPOSIT;
}
