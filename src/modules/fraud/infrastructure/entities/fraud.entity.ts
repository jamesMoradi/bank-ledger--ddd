import { CoreEntity } from 'src/common/entities/core.entity';
import { TablesNames } from 'src/common/enums/tables-name.enum';
import { AccountEntity } from 'src/modules/accounts/infrastructure/entities/account.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FraudRules } from '../../shared/enums/fraud-rules.enum';
import { FraudStatus } from '../../shared/enums/fraud-status.enum';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entities/customer.entity';

@Entity(TablesNames.FRAUDS)
export class FraudEntity extends CoreEntity {
  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => AccountEntity, (account) => account.frauds, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;

  @Column({ name: 'customer_id', nullable: false })
  customerId: string;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @Column({ type: 'enum', enum: FraudRules })
  rule: FraudRules;

  @Column({ type: 'enum', enum: FraudStatus })
  status: FraudStatus;

  @Column({
    name: 'resolved_at',
    nullable: true,
    default: null,
    type: 'timestamp',
  })
  resolvedAt: Date | null;
}
