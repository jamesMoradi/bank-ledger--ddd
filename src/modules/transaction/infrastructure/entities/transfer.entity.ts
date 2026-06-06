import { CoreEntity } from 'src/common/entities/core.entity';
import { Currencies } from 'src/common/enums/currency.enum';
import { TablesNames } from 'src/common/enums/tables-name.enum';
import { Column, Entity, ManyToOne } from 'typeorm';
import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { TransactionEntity } from './transaction.entity';

@Entity(TablesNames.TRANSACTIONS)
export class TransferEntity extends CoreEntity {
  @Column({ name: 'sender_account_id' })
  senderAccountId: string;

  @Column({ name: 'receiver_account_id' })
  receiverACcountId: string;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: Currencies })
  currency: Currencies;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ name: 'transaction_id' })
  transactionId: string;

  @ManyToOne(() => TransactionEntity, (transaction) => transaction.transfers)
  transaction: TransactionEntity;
}
