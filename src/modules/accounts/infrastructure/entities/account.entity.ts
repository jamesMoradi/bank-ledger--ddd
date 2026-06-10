import { CoreEntity } from 'src/common/entities/core.entity';
import { TablesNames } from 'src/common/enums/tables-name.enum';
import { Customer } from 'src/modules/customer/domain/entities/customer.entity';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entities/customer.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AccountStatus } from '../../shared/enums/account-status.enum';
import { Currencies } from 'src/common/enums/currency.enum';
import { TransactionEntity } from 'src/modules/transaction/infrastructure/entities/transaction.entity';

@Entity(TablesNames.ACCOUNTS)
export class AccountEntity extends CoreEntity {
  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.accounts)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column()
  iban: string;

  @Column({ default: 0 })
  balance: number;

  @Column({ enum: AccountStatus, type: 'enum' })
  status: AccountStatus;

  @Column({ type: 'enum', enum: Currencies })
  currency: Currencies;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.account)
  transactions: TransactionEntity[];
}
