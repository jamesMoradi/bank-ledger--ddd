import { Account } from '../entities/account.entity';

export const ACCOUNT_REPOSITORY = Symbol('ACCOUNT_REPOSITORY');

export interface IAccountRepository {
  save(account: Account): Promise<Account>;
  findById(id: string): Promise<Account | null>;
}
