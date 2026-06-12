import { Fraud } from '../entities/fraud.entity';

export const FRAUD_REPOSITORY = Symbol('FRAUD_REPOSITORY');

export interface IFraudRepository {
  findOneById(id: string): Promise<Fraud | null>;
  save(fraud: Fraud): Promise<void>;
  findByAccountId(accountId: string): Promise<Fraud[]>;
  findAll(): Promise<Fraud[]>;
}
