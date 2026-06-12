import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MoneyWithdrawEvent } from '../../domain/events/money-withdraw.event';

@Injectable()
export class OnMoneyWithdrawnEventHandler {
  private readonly logger = new Logger(OnMoneyWithdrawnEventHandler.name);

  @OnEvent(MoneyWithdrawEvent.name)
  handler(event: MoneyWithdrawEvent) {
    const { amount, currency, accountId } = event;
    this.logger.log(
      `${amount} ${currency} withdrawn from account with id ${accountId}`,
    );
  }
}
