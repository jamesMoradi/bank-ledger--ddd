import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  IEvent,
} from '@nestjs/cqrs';
import { CustomerUpdateEmailCommand } from '../commands/customer-update-email.command';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from '../../domain/repositories/customer.repository';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerNotFoundError } from '../../domain/errors/customer-not-found.error';

@CommandHandler(CustomerUpdateEmailCommand)
export class CustomerUpdateEmailHandler implements ICommandHandler<CustomerUpdateEmailCommand> {
  constructor(
    private readonly eventBus: EventBus,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly repository: ICustomerRepository,
  ) {}

  async execute(command: CustomerUpdateEmailCommand): Promise<Customer> {
    const { email, id } = command;
    const customer = await this.repository.findById(id);
    if (!customer) throw new CustomerNotFoundError('no customer found');
    customer.updateEmail(email);
    const updatedCustomer = await this.repository.save(customer);
    const events = customer.pullEvent();
    events.forEach((event: IEvent) => {
      this.eventBus.publish(event);
    });
    return updatedCustomer;
  }
}
