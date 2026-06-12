import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { DomainError } from 'src/modules/shared/domain/errors/domain.error';

export class FraudAlreadyResolvedError extends DomainError {
  constructor(id: string) {
    super(
      `fraud "${id}" is already resolved`,
      StatusCodes.BAD_REQUEST,
      ReasonPhrases.BAD_REQUEST,
    );
  }
}
