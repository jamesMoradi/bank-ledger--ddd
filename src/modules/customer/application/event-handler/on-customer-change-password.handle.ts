import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CustomerChangePasswordEvent } from '../../domain/events/customer-change-password.event';

@Injectable()
export class OnCustomerChangePasswordHandler {
  private readonly logger = new Logger(OnCustomerChangePasswordHandler.name);

  @OnEvent(CustomerChangePasswordEvent.name)
  handle(event: CustomerChangePasswordEvent) {
    this.logger.warn(
      `customer with id ${event.customerId} changed their password`,
    );
  }
}
