import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  IEvent,
} from '@nestjs/cqrs';
import { CustomerRegisterCommand } from '../commands/customer-register.command';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from '../../domain/repositories/customer.repository';
import { CustomerAlreadyExistsError } from '../../domain/errors/customer-already-exists.error';
import { Customer } from '../../domain/entities/customer.entity';
import { v4 as uuid } from 'uuid';
import { IPasswordHasher } from 'src/modules/shared/domain/ports/password-hasher.port';
import { PASSWORD_HASHER_SERVICE } from 'src/modules/shared/services/password-hasher.service';

export const REGISTER_CUSTOMER_HANDLER = Symbol('REGISTER_CUSTOMER_HANDLER');

@CommandHandler(CustomerRegisterCommand)
export class CustomerRegisterHandler implements ICommandHandler<CustomerRegisterCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly repository: ICustomerRepository,
    @Inject(PASSWORD_HASHER_SERVICE)
    private readonly hasherService: IPasswordHasher,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: CustomerRegisterCommand): Promise<Customer> {
    const { email, fullName, nationalId, password } = cmd;
    const isExistsByEmail = await this.repository.findByEmail(email);

    if (isExistsByEmail)
      throw new CustomerAlreadyExistsError(
        'customer with this email already exists',
      );

    const existingByNationalId =
      await this.repository.findByNationalId(nationalId);
    if (existingByNationalId)
      throw new CustomerAlreadyExistsError(
        'customer with this national id already exists',
      );

    const hashedPassword = this.hasherService.encrypt(password);
    const newCustomer = Customer.create({
      id: uuid(),
      email: email,
      fullName,
      hashedPassword,
      nationalId,
    });
    const savedCustomer = await this.repository.save(newCustomer);
    const events = savedCustomer.pullEvent();
    events.forEach((event: IEvent) => {
      this.eventBus.publish(event);
    });
    return savedCustomer;
  }
}
