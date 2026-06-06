import { CoreEntity } from 'src/common/entities/core.entity';
import { TablesNames } from 'src/common/enums/tables-name.enum';
import { Entity, OneToMany } from 'typeorm';
import { WithdrawEntity } from './withdraw.entity';
import { DepositEntity } from './deposit.entity';
import { TransferEntity } from './transfer.entity';

@Entity(TablesNames.TRANSACTIONS)
export class TransactionEntity extends CoreEntity {
  @OneToMany(() => WithdrawEntity, (withdraw) => withdraw.transaction)
  withdraws: WithdrawEntity[];

  @OneToMany(() => DepositEntity, (deposit) => deposit.transaction)
  deposits: DepositEntity[];

  @OneToMany(() => TransferEntity, (transfer) => transfer.transaction)
  transfers: TransferEntity[];
}
