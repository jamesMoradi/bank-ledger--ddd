import { Transaction } from '../../domain/entities/transaction.entity';
import { DepositEntity } from '../entities/deposit.entity';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransferEntity } from '../entities/transfer.entity';
import { WithdrawEntity } from '../entities/withdraw.entity';

export class TransactionMapper {
  static toWithDrawEntity(domain: Transaction): WithdrawEntity {
    const entity = new WithdrawEntity();
    entity.currency = domain.money.currency.code;
    entity.amount = domain.money.amount;
    entity.transactionId = domain.id;
    return entity;
  }

  static toTransferEntity(domain: Transaction): TransferEntity {
    const entity = new TransferEntity();
    entity.amount = domain.money.amount;
    entity.transactionId = domain.id;
    entity.currency = domain.money.currency.code;
    entity.receiverAccountId = domain.receiverAccountId!;
    entity.senderAccountId = domain.accountId;
    return entity;
  }

  static toDepositEntity(domain: Transaction): DepositEntity {
    const entity = new DepositEntity();
    entity.transactionId = domain.id;
    entity.amount = domain.money.amount;
    entity.currency = domain.money.currency.code;
    return entity;
  }

  static toTransactionEntity(domain: Transaction): TransactionEntity {
    const entity = new TransactionEntity();
    entity.id = domain.id;
    entity.accountId = domain.accountId;
    entity.type = domain.type;
    entity.status = domain.status.value;
    return entity;
  }

  static toDomain(
    entity: TransactionEntity,
    detail: DepositEntity | WithdrawEntity | TransferEntity,
  ): Transaction {
    const { accountId, type, status, id } = entity;
    return Transaction.reconstitute({
      id,
      accountId,
      type,
      amount: detail.amount,
      currency: detail.currency,
      status,
      receiverAccountId:
        'receiverAccountId' in detail ? detail.receiverAccountId : undefined,
    });
  }
}
