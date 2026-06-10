import { CoreEntity } from 'src/common/entities/core.entity';
import { TablesNames } from 'src/common/enums/tables-name.enum';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { Currencies } from 'src/common/enums/currency.enum';

@Entity(TablesNames.WITHDRAWS)
export class WithdrawEntity extends CoreEntity {
  @Column({ name: 'amount_out' })
  amount: number;

  @Column({ type: 'enum', enum: Currencies })
  currency: Currencies;

  @Column({ name: 'transaction_id' })
  transactionId: string;

  @OneToOne(() => TransactionEntity, (transaction) => transaction.withdraw)
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionEntity;
}
