import { Injectable, Logger } from '@nestjs/common';
import { TransferCreditedEvent } from '../../domain/events/transfer-credited.event';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OnTransferCreditedEventHandler {
  private readonly logger = new Logger(OnTransferCreditedEventHandler.name);

  @OnEvent(TransferCreditedEvent.name)
  handler(event: TransferCreditedEvent) {
    const { amount, currency, receiverAccountId, senderAccountId } = event;
    this.logger.log(
      `account with id ${receiverAccountId} received ${amount} ${currency} to account with id ${senderAccountId}`,
    );
  }
}
