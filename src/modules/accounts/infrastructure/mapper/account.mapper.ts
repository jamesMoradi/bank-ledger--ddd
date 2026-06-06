import { Account } from '../../domain/entities/account.entity';
import { AccountEntity } from '../entities/account.entity';

export class AccountMapper {
  static toDomain(entity: AccountEntity): Account {
    const {
      balance,
      createdAt,
      currency,
      customer,
      id,
      status,
      iban,
      customerId,
    } = entity;
    return Account.create({
      id,
      iban,
      balance,
      currency,
      status,
      createdAt,
      customer,
      customerId,
    });
  }

  static toEntity(domain: Account): AccountEntity {
    const entity = new AccountEntity();
    entity.id = domain.id;
    entity.status = domain.status.value;
    entity.balance = domain.money.amount;
    entity.currency = domain.money.currency.toString();
    entity.iban = domain.iban.value;
    entity.customerId = domain.customerId;
    return entity;
  }
}
