import { Account } from '../../domain/entities/account.entity';
import { AccountEntity } from '../entities/account.entity';

export class AccountMapper {
  static toDomain(entity: AccountEntity): Account {
    const { balance, createdAt, currency, customer, id, status, iban } = entity;
    return Account.create({
      id,
      iban,
      balance,
      currency,
      status,
      createdAt,
      customer,
    });
  }

  static toEntity(domain: Account): AccountEntity {
    const entity = new AccountEntity();
    entity.status = domain.status.value;
    entity.balance = domain.money.amount;
    entity.currency = domain.money.currency.toString();
    entity.iban = domain.iban.value;
    return entity;
  }
}
