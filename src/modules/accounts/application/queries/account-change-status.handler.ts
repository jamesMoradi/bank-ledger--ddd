import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountChangeStatusCommand } from '../commands/account-change-status.command';
import { IResponse } from 'src/modules/shared/response/success.response';
import { BadRequestException, Inject } from '@nestjs/common';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from '../../domain/repositories/account.repository';
import { AccountNotFoundError } from '../../domain/errors/account-not-found.error';
import { AccountStatus } from '../../shared/enums/account-status.enum';

@CommandHandler(AccountChangeStatusCommand)
export class AccountChangeStatusHandler implements ICommandHandler<AccountChangeStatusCommand> {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly repository: IAccountRepository,
  ) {}

  async execute(command: AccountChangeStatusCommand): Promise<IResponse> {
    const { id, status } = command;
    const account = await this.repository.findById(id);

    if (!account) throw new AccountNotFoundError('no account found');

    switch (status) {
      case AccountStatus.ACTIVE:
        account.activate();
        break;
      case AccountStatus.CLOSED:
        account.close();
        break;
      case AccountStatus.FROZEN:
        account.freeze();
        break;
      default:
        throw new BadRequestException('entered status is not valid');
    }

    await this.repository.save(account);

    return {
      message: `account status changed to ${status} successfully`,
    };
  }
}
