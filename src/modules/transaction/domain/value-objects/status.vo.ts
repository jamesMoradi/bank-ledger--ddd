import { isEnum } from 'class-validator';
import { TransactionStatus as TransactionStatusEnum } from '../../shared/enums/transaction.status-enum';
import { BadRequestError } from 'src/modules/shared/domain/errors/bad-request.error';

export class TransactionStatus {
  private readonly _value: TransactionStatusEnum;

  private constructor(value: TransactionStatusEnum) {
    this._value = value;
  }

  static create(value: TransactionStatusEnum): TransactionStatus {
    if (!isEnum(value, TransactionStatusEnum)) {
      throw new BadRequestError(`Invalid transaction status: "${value}"`);
    }
    return new TransactionStatus(value);
  }

  get value(): TransactionStatusEnum {
    return this._value;
  }

  is(status: TransactionStatusEnum): boolean {
    return this._value === status;
  }

  isSuccessful(): boolean {
    return this._value === TransactionStatusEnum.SUCCESSFUL;
  }

  isFailed(): boolean {
    return this._value === TransactionStatusEnum.FAILED;
  }

  isPending(): boolean {
    return this._value === TransactionStatusEnum.PENDING;
  }

  equals(other: TransactionStatus): boolean {
    return this._value === other._value;
  }
}
