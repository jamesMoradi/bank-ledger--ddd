import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { DomainError } from './domain.error';

export class CustomerUnAuthorizedError extends DomainError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);
  }
}
