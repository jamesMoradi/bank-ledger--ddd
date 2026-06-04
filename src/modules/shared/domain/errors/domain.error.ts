/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export abstract class DomainError extends Error {
  readonly reasonPhrase: ReasonPhrases;
  readonly statusCode: StatusCodes;
  readonly metadata?: any;

  constructor(
    message: string,
    statusCode: StatusCodes,
    reasonPhrase: ReasonPhrases,
    metadata?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.reasonPhrase = reasonPhrase;
    this.metadata = metadata;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
