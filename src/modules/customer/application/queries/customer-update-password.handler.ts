import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  IEvent,
} from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CustomerUpdatePasswordCommand } from '../commands/customer-update-password.command';
import { PASSWORD_HASHER_SERVICE } from 'src/modules/shared/services/password-hasher.service';
import { IPasswordHasher } from 'src/modules/shared/domain/ports/password-hasher.port';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from '../../domain/repositories/customer.repository';
import { CustomerNotFoundError } from '../../domain/errors/customer-not-found.error';
import { Customer } from '../../domain/entities/customer.entity';

@CommandHandler(CustomerUpdatePasswordCommand)
export class CustomerUpdatePasswordHandler implements ICommandHandler<CustomerUpdatePasswordCommand> {
  constructor(
    @Inject(PASSWORD_HASHER_SERVICE)
    private readonly passwordHasherService: IPasswordHasher,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly repository: ICustomerRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: CustomerUpdatePasswordCommand): Promise<Customer> {
    const { id, password } = cmd;
    const customer = await this.repository.findById(id);
    if (!customer) throw new CustomerNotFoundError('no customer found');
    const newHashedPassword = this.passwordHasherService.encrypt(password);
    customer.updateHashPassword(newHashedPassword);
    const updatedCustomer = await this.repository.save(customer);
    const events = customer.pullEvent();
    events.forEach((event: IEvent) => {
      this.eventBus.publish(event);
    });
    return updatedCustomer;
  }
}
