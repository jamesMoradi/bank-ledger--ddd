import { CoreEntity } from 'src/common/entities/core.entity';
import { Currencies } from 'src/common/enums/currency.enum';
import { TablesNames } from 'src/common/enums/tables-name.enum';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Entity(TablesNames.DEPOSITS)
export class DepositEntity extends CoreEntity {
  @Column({ name: 'amount_in' })
  amount: number;

  @Column({ type: 'enum', enum: Currencies })
  currency: Currencies;

  @Column({ name: 'transaction_id' })
  transactionId: string;

  @OneToOne(() => TransactionEntity, (transaction) => transaction.deposit)
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionEntity;
}
