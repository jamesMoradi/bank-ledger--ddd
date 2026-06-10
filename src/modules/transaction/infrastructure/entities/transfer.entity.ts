import { CoreEntity } from 'src/common/entities/core.entity';
import { Currencies } from 'src/common/enums/currency.enum';
import { TablesNames } from 'src/common/enums/tables-name.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { AccountEntity } from 'src/modules/accounts/infrastructure/entities/account.entity';

@Entity(TablesNames.TRANSFERS)
export class TransferEntity extends CoreEntity {
  @Column({ name: 'sender_account_id' })
  senderAccountId: string;

  @ManyToOne(() => AccountEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'sender_account_id' })
  senderAccount: AccountEntity;

  @Column({ name: 'receiver_account_id' })
  receiverAccountId: string;

  @ManyToOne(() => AccountEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'receiver_account_id' })
  receiverAccount: AccountEntity;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: Currencies })
  currency: Currencies;

  @Column({ name: 'transaction_id' })
  transactionId: string;

  @OneToOne(() => TransactionEntity, (transaction) => transaction.transfer)
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionEntity;
}
