import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NOTIFICATION_REPOSITORY } from '../domain/repositories/notification.repository';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationController } from '../interface/http/notification.controller';
import { NotificationEventHandler } from '../application/event-handlers/notification.event-handler';
import { NotificationService } from '../application/services/notification.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import {
  TOKEN_SERVICE,
  TokenService,
} from 'src/modules/shared/services/token.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity]), JwtModule],
  controllers: [NotificationController],
  providers: [
    JwtService,
    { provide: TOKEN_SERVICE, useClass: TokenService },
    { provide: NOTIFICATION_REPOSITORY, useClass: NotificationRepository },
    NotificationService,
    NotificationEventHandler,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
