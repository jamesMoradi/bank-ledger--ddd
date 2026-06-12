import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TransferFailedEvent } from '../../domain/events/transfer-failed.event';

@Injectable()
export class OnTransferFailedEventHandler {
  private readonly logger = new Logger(OnTransferFailedEventHandler.name);

  @OnEvent(TransferFailedEvent.name)
  handler(event: TransferFailedEvent) {
    const { amount, currency, receiverAccountId, senderAccountId } = event;
    this.logger.log(
      `account with id ${senderAccountId} couldn't transfer ${amount} ${currency} to account with id ${receiverAccountId}`,
    );
  }
}
