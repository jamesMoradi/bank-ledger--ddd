import { NotificationType } from '../enums/notification-type.enum';

export type NotificationMessage = {
  message: string;
  type: NotificationType;
  occurredAt: Date;
};
