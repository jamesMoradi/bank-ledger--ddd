import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeormConfig } from './configs/typeorm.config';
import { CqrsModule } from '@nestjs/cqrs';
import { CustomerModule } from './modules/customer/interfaces/customer.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeormConfig.forRoot(),
    CqrsModule.forRoot(),
    EventEmitterModule.forRoot(),
    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
