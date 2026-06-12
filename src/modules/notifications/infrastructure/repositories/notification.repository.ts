import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { INotificationRepository } from '../../domain/repositories/notification.repository';
import { Repository } from 'typeorm';
import { NotificationMapper } from '../mappers/notification.mapper';
import { NotificationEntity } from '../entities/notification.entity';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
  ) {}

  async save(notification: Notification): Promise<void> {
    await this.repository.save(NotificationMapper.toEntity(notification));
  }

  async findByCustomerId(customerId: string): Promise<Notification[]> {
    const entities = await this.repository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => NotificationMapper.toDomain(entity));
  }

  async findUnreadByCustomerId(customerId: string): Promise<Notification[]> {
    const entities = await this.repository.find({
      where: { customerId, isRead: false },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => NotificationMapper.toDomain(entity));
  }

  async markAllAsRead(customerId: string): Promise<void> {
    await this.repository.update(
      { customerId, isRead: false },
      { isRead: true },
    );
  }
}
