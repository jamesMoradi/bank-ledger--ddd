import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CustomerChangeFullNameEvent } from '../../domain/events/customer-change-fullname.event';

@Injectable()
export class OnCustomerChangeFullNameHandler {
  private readonly logger = new Logger(OnCustomerChangeFullNameHandler.name);
  @OnEvent(CustomerChangeFullNameEvent.name)
  handle(event: CustomerChangeFullNameEvent) {
    this.logger.log(
      `customer with id ${event.customerId} updated their fullname to ${event.fullName}`,
    );
  }
}
