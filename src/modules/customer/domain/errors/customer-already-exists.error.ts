import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { DomainError } from 'src/modules/shared/domain/errors/domain.error';

export class CustomerAlreadyExistsError extends DomainError {
  constructor(message: string) {
    super(message, StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);
  }
}
