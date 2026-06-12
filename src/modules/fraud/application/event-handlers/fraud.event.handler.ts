import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FraudRules } from '../../shared/enums/fraud-rules.enum';
import {
  FRAUD_REPOSITORY,
  IFraudRepository,
} from '../../domain/repositories/fraud.repository';
import { Fraud } from '../../domain/entities/fraud.entity';
import { v4 as uuid } from 'uuid';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from 'src/modules/transaction/domain/repositories/transaction.repository';
import { TransactionFraudEvent } from '../../domain/events/transaction.event';
import { WithdrawFraudEvent } from '../../domain/events/withdraw.event';
import { TransactionType } from 'src/modules/transaction/shared/enums/transaction-type.enum';
import { EventBus } from '@nestjs/cqrs';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from 'src/modules/accounts/domain/repositories/account.repository';

@Injectable()
export class FraudEventHandler {
  private readonly logger = new Logger(FraudEventHandler.name);

  constructor(
    @Inject(FRAUD_REPOSITORY)
    private readonly fraudRepository: IFraudRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    private readonly eventBus: EventBus,
  ) {}

  @OnEvent(WithdrawFraudEvent.name)
  async onMoneyWithdrawn(event: WithdrawFraudEvent): Promise<void> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentWithdrawals =
      await this.transactionRepository.findByAccountIdAndType(
        event.accountId,
        TransactionType.WITHDRAW,
        oneHourAgo,
      );

    if (recentWithdrawals.length > 5) {
      await this.createAlert(event.accountId, FraudRules.TOO_MANY_WITHDRAWS);
    }

    if (event.amount > 8_000) {
      await this.createAlert(event.accountId, FraudRules.LARGE_TRANSACTION);
    }
  }

  @OnEvent(TransactionFraudEvent.name)
  async onTransactionFailed(event: TransactionFraudEvent): Promise<void> {
    if (event.type !== TransactionType.TRANSFER_OUT) return;

    const recentFailures =
      await this.transactionRepository.findFailedTransfersByAccountId(
        event.accountId,
        3,
      );

    if (recentFailures.length >= 3) {
      await this.createAlert(event.accountId, FraudRules.REPEATED_FAILURES);
    }
  }

  private async createAlert(
    accountId: string,
    rule: FraudRules,
  ): Promise<void> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      this.logger.error(
        `Account ${accountId} not found when creating fraud alert`,
      );
      return;
    }

    const fraud = Fraud.create({
      id: uuid(),
      accountId,
      customerId: account.customerId,
      rule,
    });

    await this.fraudRepository.save(fraud);

    fraud.pullEvents().forEach((e) => {
      this.eventBus.publish(e);
    });

    this.logger.warn(
      `Fraud created [${rule.replace(/_/g, ' ')}] for account ${accountId}`,
    );
  }
}
