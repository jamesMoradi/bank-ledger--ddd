import { Inject, Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';
import {
  INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '../../domain/repositories/notification.repository';
import { NotificationMessage } from '../../shared/types/message.type';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly streams = new Map<string, Subject<MessageEvent>>();

  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  getStream(customerId: string) {
    if (!this.streams.has(customerId)) {
      this.streams.set(customerId, new Subject<MessageEvent>());
      this.logger.log(`SSE stream opened for customer ${customerId}`);
    }
    return this.streams.get(customerId)!.asObservable();
  }

  push(customerId: string, payload: NotificationMessage) {
    const stream = this.streams.get(customerId);
    if (stream) {
      stream.next({ data: payload } as MessageEvent);
      this.logger.log(`SSE push to customer ${customerId}: ${payload.message}`);
    }
  }

  closeStream(customerId: string) {
    const stream = this.streams.get(customerId);
    if (stream) {
      stream.complete();
      this.streams.delete(customerId);
      this.logger.log(`SSE stream closed for customer ${customerId}`);
    }
  }
}
