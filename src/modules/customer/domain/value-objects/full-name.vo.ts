import { isEmpty, isString } from 'class-validator';
import { BadRequestError } from 'src/modules/shared/domain/errors/bad-request.error';

export class FullName {
  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  static create(value: string) {
    if (isEmpty(value)) throw new BadRequestError('full name can not be empty');
    if (!isString(value))
      throw new BadRequestError('full name should be an string');
    if (value.length < 10)
      throw new BadRequestError('full name must be more than 10 characters');
    return new FullName(value);
  }

  isEquals = (other: FullName) => this.value.trim() === other.value.trim();

  get value() {
    return this._value;
  }
}
