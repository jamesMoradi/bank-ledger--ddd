import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MoneyDepositedEvent } from '../../domain/events/money-deposit.event';

@Injectable()
export class OnMoneyDepositedEventHandler {
  private readonly logger = new Logger(OnMoneyDepositedEventHandler.name);

  @OnEvent(MoneyDepositedEvent.name)
  handler(event: MoneyDepositedEvent) {
    const { amount, currency, accountId } = event;
    this.logger.log(
      `${amount} ${currency} deposited from account with id ${accountId}`,
    );
  }
}
