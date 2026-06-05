import { isEmpty, isString } from 'class-validator';
import { BadRequestError } from 'src/modules/shared/domain/errors/bad-request.error';

export class NationalId {
  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  static create(nationalId: string) {
    if (isEmpty(nationalId))
      throw new BadRequestError('national id should not be empty');
    if (!isString(nationalId))
      throw new BadRequestError('national id should be an string');
    if (nationalId.length < 9 && nationalId.length > 16)
      throw new BadRequestError(
        'national ids length should be between 9 and 16',
      );

    return new NationalId(nationalId);
  }

  isEquals = (other: NationalId) => this.value === other.value;

  get value() {
    return this._value;
  }
}
