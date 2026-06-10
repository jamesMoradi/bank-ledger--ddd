import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllByAccountIdCommand } from '../commands/get-all-by-account-id.command';
import { Inject } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';

@QueryHandler(GetAllByAccountIdCommand)
export class GetAllByACcountIdQuery implements IQueryHandler<GetAllByAccountIdCommand> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repository: ITransactionRepository,
  ) {}

  async execute(cmd: GetAllByAccountIdCommand): Promise<Transaction[]> {
    const { accountId } = cmd;
    const transactions = await this.repository.findAllByAccountId(accountId);
    return transactions;
  }
}
