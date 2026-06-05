import { isEmail } from 'class-validator';
import { BadRequestError } from 'src/modules/shared/domain/errors/bad-request.error';

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string) {
    if (!isEmail(value)) throw new BadRequestError('email is not valid');
    return new Email(value);
  }

  equals = (other: Email) => this._value === other._value;

  get value() {
    return this._value;
  }
}
