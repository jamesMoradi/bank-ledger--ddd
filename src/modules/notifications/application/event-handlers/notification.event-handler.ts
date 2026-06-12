import { Inject, Injectable } from '@nestjs/common';
import {
  INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '../../domain/repositories/notification.repository';
import { NotificationService } from '../services/notification.service';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { v4 as uuid } from 'uuid';
import { Notification } from '../../domain/entities/notification.entity';
import { FraudDetectedEvent } from 'src/modules/fraud/domain/events/fraud-detected.event';
import { AccountFrozenEvent } from 'src/modules/accounts/domain/events/account-frozen.event';
import { AccountOpenedEvent } from 'src/modules/accounts/domain/events/accoun-opened.event';
import { AccountClosedEvent } from 'src/modules/accounts/domain/events/account-closed.event';
import { MoneyDepositedEvent } from 'src/modules/transaction/domain/events/money-deposit.event';
import { TransactionFailedEvent } from 'src/modules/transaction/domain/events/transaction-failed.event';
import { TransferInitiatedEvent } from 'src/modules/transaction/domain/events/transfer-initialized.event';
import { MoneyWithdrawEvent } from 'src/modules/transaction/domain/events/money-withdraw.event';

@Injectable()
export class NotificationEventHandler {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
    private readonly sseService: NotificationService,
  ) {}

  @OnEvent(AccountOpenedEvent.name)
  async onAccountOpened(event: AccountOpenedEvent): Promise<void> {
    await this.send(
      event.customerId,
      `Your account with IBAN ${event.iban} has been opened successfully`,
      NotificationType.ACCOUNT_OPENED,
    );
  }

  @OnEvent(AccountFrozenEvent.name)
  async onAccountFrozen(event: AccountFrozenEvent): Promise<void> {
    await this.send(
      event.customerId,
      `Your account has been frozen. Please contact support`,
      NotificationType.ACCOUNT_FROZEN,
    );
  }

  @OnEvent(AccountClosedEvent.name)
  async onAccountClosed(event: AccountClosedEvent): Promise<void> {
    await this.send(
      event.customerId,
      `Your account has been permanently closed`,
      NotificationType.ACCOUNT_CLOSED,
    );
  }

  @OnEvent(MoneyDepositedEvent.name)
  async onMoneyDeposited(event: MoneyDepositedEvent): Promise<void> {
    await this.send(
      event.accountId,
      `${event.amount} ${event.currency} has been deposited into your account`,
      NotificationType.MONEY_DEPOSITED,
    );
  }

  @OnEvent(MoneyWithdrawEvent.name)
  async onMoneyWithdrawn(event: MoneyWithdrawEvent): Promise<void> {
    await this.send(
      event.accountId,
      `${event.amount} ${event.currency} has been withdrawn from your account`,
      NotificationType.MONEY_WITHDRAWN,
    );
  }

  @OnEvent(TransferInitiatedEvent.name)
  async onTransferInitiated(event: TransferInitiatedEvent): Promise<void> {
    await this.send(
      event.senderCustomerId,
      `You sent ${event.amount} ${event.currency} to another account`,
      NotificationType.TRANSFER_DEBITED,
    );
    await this.send(
      event.receiverCustomerId,
      `You received ${event.amount} ${event.currency}`,
      NotificationType.TRANSFER_CREDITED,
    );
  }

  @OnEvent(TransactionFailedEvent.name)
  async onTransactionFailed(event: TransactionFailedEvent): Promise<void> {
    await this.send(
      event.customerId,
      `Your transaction of ${event.amount} ${event.currency} has failed`,
      NotificationType.TRANSFER_FAILED,
    );
  }

  @OnEvent(FraudDetectedEvent.name)
  async onFraudDetected(event: FraudDetectedEvent): Promise<void> {
    await this.send(
      event.customerId,
      `suspicious activity detected on your account: ${event.rule.replace(/_/g, ' ')}. Your account has been frozen`,
      NotificationType.FRAUD_DETECTED,
    );
  }

  private async send(
    customerId: string,
    message: string,
    type: NotificationType,
  ): Promise<void> {
    const notification = Notification.create({
      id: uuid(),
      customerId,
      message,
      type,
    });
    await this.notificationRepository.save(notification);

    this.sseService.push(customerId, {
      type,
      message,
      occurredAt: notification.createdAt,
    });
  }
}
