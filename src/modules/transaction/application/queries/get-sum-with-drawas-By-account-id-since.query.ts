import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSumWithdrawalsByAccountIdSinceCommand } from '../commands/get-sum-withdraws-By-account-id-since.command';
import { Inject } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repositories/transaction.repository';

@QueryHandler(FindSumWithdrawalsByAccountIdSinceCommand)
export class FindSumWithdrawalsByAccountIdSinceQuery implements IQueryHandler<FindSumWithdrawalsByAccountIdSinceCommand> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repository: ITransactionRepository,
  ) {}
  async execute(
    query: FindSumWithdrawalsByAccountIdSinceCommand,
  ): Promise<number> {
    const { accountId, since } = query;
    const sum = await this.repository.sumWithdrawalsByAccountIdSince(
      accountId,
      since,
    );
    return sum;
  }
}
