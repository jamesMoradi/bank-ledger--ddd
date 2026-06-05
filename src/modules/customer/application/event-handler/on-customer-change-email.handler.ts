import { Injectable, Logger } from '@nestjs/common';
import { CustomerChangeEmailEvent } from '../../domain/events/customer-change-email.event';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OnCustomerChangeEmailHandler {
  private readonly logger = new Logger(OnCustomerChangeEmailHandler.name);

  @OnEvent(CustomerChangeEmailEvent.name)
  handle(event: CustomerChangeEmailEvent) {
    this.logger.warn(
      `customer with id ${event.customerId} changed their email to ${event.newEmail}`,
    );
  }
}
