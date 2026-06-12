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
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { Notification } from '../../domain/entities/notification.entity';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

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
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  getAll(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<Notification[]> {
    return this.notificationRepository.findByCustomerId(customerId);
  }

  @Get(':customerId/unread')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  getUnread(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<Notification[]> {
    return this.notificationRepository.findUnreadByCustomerId(customerId);
  }

  @Get(':customerId/read-all')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  markAllAsRead(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<void> {
    return this.notificationRepository.markAllAsRead(customerId);
  }
}
