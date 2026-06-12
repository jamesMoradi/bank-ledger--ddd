import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TransferDebitedEvent } from '../../domain/events/transfer-debit.event';

@Injectable()
export class OnTransferDebitedEventHandler {
  private readonly logger = new Logger(OnTransferDebitedEventHandler.name);

  @OnEvent(TransferDebitedEvent.name)
  handler(event: TransferDebitedEvent) {
    const { amount, currency, receiverAccountId, senderAccountId } = event;
    this.logger.log(
      `account with id ${senderAccountId} sends ${amount} ${currency} to account with id ${receiverAccountId}`,
    );
  }
}
