import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { DomainError } from 'src/modules/shared/domain/errors/domain.error';

export class FraudNotFoundError extends DomainError {
  constructor(id: string) {
    super(
      `Fraud with id "${id}" not found`,
      StatusCodes.NOT_FOUND,
      ReasonPhrases.NOT_FOUND,
    );
  }
}
