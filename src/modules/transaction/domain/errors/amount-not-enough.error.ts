import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { DomainError } from 'src/modules/shared/domain/errors/domain.error';

export class AmountNotEnoughError extends DomainError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST);
  }
}
