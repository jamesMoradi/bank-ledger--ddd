import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFailedByAccountIdCommand } from '../commands/get-failed.command';
import { Inject } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repositories/transaction.repository';

@QueryHandler(GetFailedByAccountIdCommand)
export class GetFiledByAccountIdQuery implements IQueryHandler<GetFailedByAccountIdCommand> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repository: ITransactionRepository,
  ) {}

  async execute(query: GetFailedByAccountIdCommand): Promise<any> {
    const { accountId, limit } = query;
    const transactions = await this.repository.findFailedTransfersByAccountId(
      accountId,
      limit,
    );
    return transactions;
  }
}
