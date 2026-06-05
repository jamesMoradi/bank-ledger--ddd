import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  IEvent,
} from '@nestjs/cqrs';
import { CustomerUpdateFullNameCommand } from '../commands/customer-update-full-name.command';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from '../../domain/repositories/customer.repository';
import { CustomerNotFoundError } from '../../domain/errors/customer-not-found.error';

@CommandHandler(CustomerUpdateFullNameCommand)
export class CustomerUpdateFullNameHandler implements ICommandHandler<CustomerUpdateFullNameCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly repository: ICustomerRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: CustomerUpdateFullNameCommand): Promise<void> {
    const { fullName, id } = cmd;
    const customer = await this.repository.findById(id);
    if (!customer) throw new CustomerNotFoundError('no customer found');
    customer.updateFullName(fullName);
    await this.repository.save(customer);
    const events = customer.pullEvent();
    events.forEach((event: IEvent) => {
      this.eventBus.publish(event);
    });
  }
}
