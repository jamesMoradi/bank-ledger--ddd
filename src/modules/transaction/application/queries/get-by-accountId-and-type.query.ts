import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByAccountIdAndTypeCommand } from '../commands/get-by-accountId-and-type.command';
import { Inject } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';

@QueryHandler(GetByAccountIdAndTypeCommand)
export class GetByAccountIdAndTypeQuery implements IQueryHandler<GetByAccountIdAndTypeCommand> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repository: ITransactionRepository,
  ) {}

  async execute(query: GetByAccountIdAndTypeCommand): Promise<Transaction[]> {
    const { accountId, since, type } = query;
    const transactions = await this.repository.findByAccountIdAndType(
      accountId,
      type,
      since,
    );
    return transactions;
  }
}
