import { isEnum } from 'class-validator';
import { FraudStatus as FraudStatusEnum } from '../../shared/enums/fraud-status.enum';
import { BadRequestError } from 'src/modules/shared/domain/errors/bad-request.error';

export class FraudStatus {
  private readonly _value: FraudStatusEnum;

  private constructor(value: FraudStatusEnum) {
    this._value = value;
  }

  static create(other: FraudStatusEnum) {
    if (!isEnum(other, FraudStatusEnum))
      throw new BadRequestError('invalid fraud status');
    return new FraudStatus(other);
  }

  get value(): FraudStatusEnum {
    return this._value;
  }

  isOpen = () => this._value === FraudStatusEnum.OPEN;

  equals = (other: FraudStatus) => this._value === other._value;

  isResolved = () => this._value === FraudStatusEnum.RESOLVED;
}
