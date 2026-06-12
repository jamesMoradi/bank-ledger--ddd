import {
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Sse,
} from '@nestjs/common';
import { NotificationService } from '../../application/services/notification.service';
import {
  INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '../../domain/repositories/notification.repository';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { Notification } from '../../domain/entities/notification.entity';

@ApiTags('Notifications')
@Controller('notifications')
@AuthDecorator()
export class NotificationController {
  constructor(
    private readonly sseService: NotificationService,
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  @Sse('stream/:customerId')
  stream(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Observable<MessageEvent> {
    return this.sseService.getStream(customerId);
  }

  @Get(':customerId')
  getAll(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<Notification[]> {
    return this.notificationRepository.findByCustomerId(customerId);
  }

  @Get(':customerId/unread')
  getUnread(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<Notification[]> {
    return this.notificationRepository.findUnreadByCustomerId(customerId);
  }

  @Get(':customerId/read-all')
  markAllAsRead(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<void> {
    return this.notificationRepository.markAllAsRead(customerId);
  }
}
