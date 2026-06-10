import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneByIdCommand } from '../commands/get-by-id.commands';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repositories/transaction.repository';
import { Inject } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';

@QueryHandler(GetOneByIdCommand)
export class GetOneByIdQuery implements IQueryHandler<GetOneByIdCommand> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repository: ITransactionRepository,
  ) {}

  async execute(query: GetOneByIdCommand): Promise<Transaction | null> {
    const { id } = query;
    const transaction = await this.repository.getById(id);
    return transaction;
  }
}
