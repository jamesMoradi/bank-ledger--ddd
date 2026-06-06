import { BadRequestError } from 'src/modules/shared/domain/errors/bad-request.error';
import { AccountStatus } from '../../shared/enums/account-status.enum';
import { isEnum } from 'class-validator';

export class Status {
  private _value: AccountStatus;

  private constructor(value: AccountStatus) {
    this._value = value;
  }

  static create(other: AccountStatus) {
    if (!isEnum(other, AccountStatus))
      throw new BadRequestError('new status is undefined');

    return new Status(other);
  }

  get value() {
    return this._value;
  }

  equals = (other: Status) => this._value === other._value;

  is = (other: AccountStatus) => this.value === other;
}
