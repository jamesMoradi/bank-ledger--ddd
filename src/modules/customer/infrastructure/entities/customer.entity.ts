import { CoreEntity } from 'src/common/entities/core.entity';
import { TablesNames } from 'src/common/enums/tables-name.enum';
import { AccountEntity } from 'src/modules/accounts/infrastructure/entities/account.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity(TablesNames.CUSTOMERS)
export class CustomerEntity extends CoreEntity {
  @Column({ name: 'full_name', nullable: false })
  fullName: string;

  @Column({ name: 'national_id', unique: true })
  nationalId: string;

  @Column({ name: 'hash_password', nullable: false })
  hashedPassword: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => AccountEntity, (accounts) => accounts.customer)
  accounts: AccountEntity[];
}
