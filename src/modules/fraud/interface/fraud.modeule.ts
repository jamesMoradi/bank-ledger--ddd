import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FraudEntity } from '../infrastructure/entities/fraud.entity';
import { AccountModule } from 'src/modules/accounts/interfaces/account.module';
import { TransactionModule } from 'src/modules/transaction/infrastructure/transaction.module';
import { FRAUD_REPOSITORY } from '../domain/repositories/fraud.repository';
import { FraudRepository } from '../infrastructure/repositories/fraud.repository';
import { FraudEventHandler } from '../application/event-handlers/fraud.event.handler';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([FraudEntity]),
    AccountModule,
    TransactionModule,
  ],
  providers: [
    { provide: FRAUD_REPOSITORY, useClass: FraudRepository },
    FraudEventHandler,
  ],
  exports: [FRAUD_REPOSITORY],
})
export class FraudModule {}
