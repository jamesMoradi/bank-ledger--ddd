import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DepositCommand } from '../commands/deposit.command';
import { Inject } from '@nestjs/common';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from 'src/modules/accounts/domain/repositories/account.repository';
import { AccountNotFoundError } from 'src/modules/accounts/domain/errors/account-not-found.error';
import { IResponse } from 'src/modules/shared/response/success.response';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';
import { v4 as uuid } from 'uuid';

@CommandHandler(DepositCommand)
export class DepositHandler implements ICommandHandler<DepositCommand> {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(command: DepositCommand): Promise<IResponse> {
    const { accountId, amount, currency } = command;
    const account = await this.accountRepository.findById(accountId);
    if (!account) throw new AccountNotFoundError('no account exists');

    const transaction = Transaction.createDeposit({
      id: uuid(),
      accountId,
      amount,
      currency,
    });

    try {
      account.increaseBalance(amount, currency);
      await this.accountRepository.save(account);
      transaction.markAsCompleted();
      await this.transactionRepository.save(transaction);
    } catch (error) {
      transaction.markAsFailed();
      throw error;
    }

    return { message: `${amount} ${currency} added to your balance` };
  }
}
