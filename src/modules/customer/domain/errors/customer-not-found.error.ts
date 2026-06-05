import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { DomainError } from 'src/modules/shared/domain/errors/domain.error';

export class CustomerNotFoundError extends DomainError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
  }
}
