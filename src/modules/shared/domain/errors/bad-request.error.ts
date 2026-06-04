import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { DomainError } from './domain.error';

export class BadRequestError extends DomainError {
  constructor(message: string, metadata?: any) {
    super(
      message,
      StatusCodes.BAD_REQUEST,
      ReasonPhrases.BAD_REQUEST,
      metadata,
    );
  }
}
