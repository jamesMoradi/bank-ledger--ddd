import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CustomerRegisteredEvent } from '../../domain/events/customer-register.event';

@Injectable()
export class OnCustomerRegisterHandler {
  private readonly logger = new Logger(OnCustomerRegisterHandler.name);

  @OnEvent(CustomerRegisteredEvent.name)
  handle(event: CustomerRegisteredEvent): void {
    this.logger.log(
      `New customer registered - email: ${event.email} , name: ${event.fullName}`,
    );
  }
}
