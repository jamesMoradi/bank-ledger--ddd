import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from 'src/modules/accounts/domain/repositories/account.repository';
import { Inject } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repositories/transaction.repository';
import { AccountNotFoundError } from 'src/modules/accounts/domain/errors/account-not-found.error';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransferCommand } from '../commands/transfer.command';
import { DailyLimitExceededError } from '../../domain/errors/daily-limit.error';
import { v4 as uuid } from 'uuid';

@CommandHandler(TransferCommand)
export class TransferHandler implements ICommandHandler<TransferCommand> {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    // private readonly eventBus: EventBus,
  ) {}

  async execute(command: TransferCommand): Promise<{ message: string }> {
    const { accountId, amount, currency, receiverAccountId } = command;

    const senderAccount = await this.accountRepository.findById(accountId);
    if (!senderAccount) throw new AccountNotFoundError(accountId);

    const receiverAccount =
      await this.accountRepository.findById(receiverAccountId);
    if (!receiverAccount) throw new AccountNotFoundError(receiverAccountId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyTotal =
      await this.transactionRepository.sumWithdrawalsByAccountIdSince(
        accountId,
        today,
      );
    if (dailyTotal + amount > 20_000) {
      throw new DailyLimitExceededError(accountId);
    }

    const transaction = Transaction.createTransfer({
      id: uuid(),
      accountId,
      amount,
      currency,
      receiverAccountId,
    });
    await this.transactionRepository.save(transaction);

    try {
      senderAccount.decreaseBalance(amount, currency);
      receiverAccount.increaseBalance(amount, currency);
      await this.accountRepository.save(senderAccount);
      await this.accountRepository.save(receiverAccount);
      transaction.markAsCompleted();
    } catch (error) {
      transaction.markAsFailed();
      await this.transactionRepository.save(transaction);
      //   transaction.pullEvents().forEach((e) => this.eventBus.publish(e));
      throw error;
    }

    await this.transactionRepository.save(transaction);

    // senderAccount.pullEvents().forEach((e) => this.eventBus.publish(e));
    // receiverAccount.pullEvents().forEach((e) => this.eventBus.publish(e));
    // transaction.pullEvents().forEach((e) => this.eventBus.publish(e));

    return { message: 'Amount transferred successfully' };
  }
}
