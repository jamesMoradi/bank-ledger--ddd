import { Module } from '@nestjs/common';
import { OnMoneyDepositedEventHandler } from './on-money-deposit.event-handler';
import { OnMoneyWithdrawnEventHandler } from './on-money-withdraw.event-handler';
import { OnTransferCreditedEventHandler } from './on-transfer-credited.event-handler';
import { OnTransferDebitedEventHandler } from './on-transfer-debited.event';
import { OnTransferFailedEventHandler } from './on-transfer-failed.event-handler';

@Module({
  providers: [
    OnMoneyDepositedEventHandler,
    OnMoneyWithdrawnEventHandler,
    OnTransferCreditedEventHandler,
    OnTransferDebitedEventHandler,
    OnTransferFailedEventHandler,
  ],
})
export class TransactionEventHandlerModule {}
