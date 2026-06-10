import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeormConfig } from './configs/typeorm.config';
import { CqrsModule } from '@nestjs/cqrs';
import { CustomerModule } from './modules/customer/interfaces/customer.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AccountModule } from './modules/accounts/interfaces/account.module';
import { TransactionModule } from './modules/transaction/infrastructure/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeormConfig.forRoot(),
    CqrsModule.forRoot(),
    EventEmitterModule.forRoot(),
    CustomerModule,
    AccountModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
