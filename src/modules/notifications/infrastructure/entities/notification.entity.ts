import { TablesNames } from 'src/common/enums/tables-name.enum';
import { Column, Entity, ManyToOne } from 'typeorm';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entities/customer.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

@Entity(TablesNames.NOTIFICATIONS)
export class NotificationEntity extends CoreEntity {
  @Column({ name: 'customer_id', nullable: false })
  customerId: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.notifications)
  customer: CustomerEntity;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ type: 'enum', enum: NotificationType, nullable: false })
  type: NotificationType;

  @Column({ name: 'is_read', default: false, nullable: false })
  isRead: boolean;
}
