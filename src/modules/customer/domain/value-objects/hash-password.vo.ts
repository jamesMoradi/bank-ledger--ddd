import { isEmpty, isString } from 'class-validator';
import { BadRequestError } from 'src/modules/shared/domain/errors/bad-request.error';

export class HashPassword {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string) {
    if (isEmpty(value)) throw new BadRequestError('hash password is not valid');
    if (!isString(value))
      throw new BadRequestError('hash password must be an string');
    if (value.length < 20)
      throw new BadRequestError('hash password is not long enough');
    return new HashPassword(value);
  }

  equals = (other: HashPassword) => this._value === other._value;

  get value() {
    return this._value;
  }
}
