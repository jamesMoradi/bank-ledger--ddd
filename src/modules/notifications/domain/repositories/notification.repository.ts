import { Notification } from '../entities/notification.entity';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface INotificationRepository {
  save(notification: Notification): Promise<void>;
  findByCustomerId(customerId: string): Promise<Notification[]>;
  findUnreadByCustomerId(customerId: string): Promise<Notification[]>;
  markAllAsRead(customerId: string): Promise<void>;
}
