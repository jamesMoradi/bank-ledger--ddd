import { Notification } from '../../domain/entities/notification.entity';
import { NotificationEntity } from '../entities/notification.entity';

export class NotificationMapper {
  static toEntity(domain: Notification): NotificationEntity {
    const entity = new NotificationEntity();
    entity.id = domain.id;
    entity.customerId = domain.customerId;
    entity.message = domain.message;
    entity.type = domain.type;
    entity.isRead = domain.isRead;
    return entity;
  }

  static toDomain(entity: NotificationEntity): Notification {
    return Notification.reconstitute({
      id: entity.id,
      customerId: entity.customerId,
      message: entity.message,
      type: entity.type,
      isRead: entity.isRead,
      createdAt: entity.createdAt,
    });
  }
}
