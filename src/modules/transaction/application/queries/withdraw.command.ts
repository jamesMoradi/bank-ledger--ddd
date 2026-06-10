import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WithdrawCommand } from '../commands/withdraw.command';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from 'src/modules/accounts/domain/repositories/account.repository';
import { Inject } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repositories/transaction.repository';
import { IResponse } from 'src/modules/shared/response/success.response';
import { AccountNotFoundError } from 'src/modules/accounts/domain/errors/account-not-found.error';
import { Transaction } from '../../domain/entities/transaction.entity';
import { v4 as uuid } from 'uuid';
import { DailyLimitExceededError } from '../../domain/errors/daily-limit.error';

@CommandHandler(WithdrawCommand)
export class WithdrawHandler implements ICommandHandler<WithdrawCommand> {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(command: WithdrawCommand): Promise<IResponse> {
    const { accountId, amount, currency } = command;

    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new AccountNotFoundError('no account exists');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTotal =
      await this.transactionRepository.sumWithdrawalsByAccountIdSince(
        accountId,
        today,
      );
    if (todayTotal + amount > 20000)
      throw new DailyLimitExceededError(
        `you reached your 20,000 ${currency} per day limit`,
      );

    const transaction = Transaction.createWithdraw({
      id: uuid(),
      accountId,
      amount,
      currency,
    });
    await this.transactionRepository.save(transaction);

    try {
      account.decreaseBalance(amount, currency);

      await this.accountRepository.save(account);
      transaction.markAsCompleted();
    } catch (error) {
      transaction.markAsFailed();

      throw error;
    }

    await this.transactionRepository.save(transaction);
    return { message: `${amount} ${currency} decreased from your balance` };
  }
}
