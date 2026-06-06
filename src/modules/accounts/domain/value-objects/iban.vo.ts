import { BadRequestError } from 'src/modules/shared/domain/errors/bad-request.error';

export class IBAN {
  private _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string) {
    if (!value.startsWith('DE') || value.length < 16)
      throw new BadRequestError('ibans length must be at least 16');

    return new IBAN(value);
  }

  static generate(): IBAN {
    const iban = 'DE' + Math.random().toString().slice(2, 16).padEnd(16, '0');

    return new IBAN(iban);
  }

  get value() {
    return this._value;
  }

  isEquals = (value: IBAN) => this.value === value.value;
}
