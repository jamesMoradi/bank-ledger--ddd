import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { Transaction } from '../entities/transaction.entity';

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  getById(id: string): Promise<Transaction | null>;
  findByAccountIdAndType(
    accountId: string,
    type: TransactionType,
    since: Date,
  ): Promise<Transaction[]>;

  findFailedTransfersByAccountId(
    accountId: string,
    limit: number,
  ): Promise<Transaction[]>;

  findAllByAccountId(accountId: string): Promise<Transaction[]>;

  sumWithdrawalsByAccountIdSince(
    accountId: string,
    since: Date,
  ): Promise<number>;
}
