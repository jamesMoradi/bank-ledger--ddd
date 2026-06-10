import { CoreEntity } from 'src/common/entities/core.entity';
import { TablesNames } from 'src/common/enums/tables-name.enum';
import { Column, Entity, OneToOne, ManyToOne } from 'typeorm';
import { WithdrawEntity } from './withdraw.entity';
import { DepositEntity } from './deposit.entity';
import { TransferEntity } from './transfer.entity';
import { AccountEntity } from 'src/modules/accounts/infrastructure/entities/account.entity';
import { TransactionStatus } from '../../shared/enums/transaction.status-enum';
import { TransactionType } from '../../shared/enums/transaction-type.enum';

@Entity(TablesNames.TRANSACTIONS)
export class TransactionEntity extends CoreEntity {
  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => AccountEntity, (account) => account.transactions, {
    onDelete: 'CASCADE',
  })
  account: AccountEntity;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @OneToOne(() => WithdrawEntity, (withdraw) => withdraw.transaction, {
    cascade: false,
    nullable: true,
  })
  withdraw: WithdrawEntity;

  @OneToOne(() => DepositEntity, (deposit) => deposit.transaction, {
    cascade: false,
    nullable: true,
  })
  deposit: DepositEntity;

  @OneToOne(() => TransferEntity, (transfer) => transfer.transaction, {
    cascade: false,
    nullable: true,
  })
  transfer: TransferEntity;
}
