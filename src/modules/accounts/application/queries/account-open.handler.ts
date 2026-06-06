import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountOpenCommand } from '../commands/account-open.command';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from 'src/modules/customer/domain/repositories/customer.repository';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from '../../domain/repositories/account.repository';
import { CustomerNotFoundError } from 'src/modules/customer/domain/errors/customer-not-found.error';
import { MaximumAccountLimitReachError } from '../../domain/errors/max-account-reach.error';
import { Account } from '../../domain/entities/account.entity';
import { AccountStatus } from '../../shared/enums/account-status.enum';

@CommandHandler(AccountOpenCommand)
export class AccountOpenHandler implements ICommandHandler<AccountOpenCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
  ) {}
  async execute(command: AccountOpenCommand): Promise<{ message: string }> {
    const { customerId, currency } = command;
    const customer =
      await this.customerRepository.findCustomerWithAccount(customerId);
    if (!customer) throw new CustomerNotFoundError('no customer exists');
    if (customer.accountsCount >= 3)
      throw new MaximumAccountLimitReachError(
        "dear customer you can't have more than 3 accounts",
      );
    const newAccount = Account.create({
      id: undefined,
      balance: 0,
      customer: customer,
      status: AccountStatus.ACTIVE,
      currency,
    });
    await this.accountRepository.save(newAccount);
    return {
      message: 'new account created successfully',
    };
  }
}
