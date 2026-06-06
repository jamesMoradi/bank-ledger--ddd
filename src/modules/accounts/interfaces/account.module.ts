import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entities/customer.entity';
import { AccountEntity } from '../infrastructure/entities/account.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountController } from './http/account.controller';
import { ACCOUNT_REPOSITORY } from '../domain/repositories/account.repository';
import { AccountRepository } from '../infrastructure/repositories/account.repository';
import { CUSTOMER_REPOSITORY } from 'src/modules/customer/domain/repositories/customer.repository';
import { CustomerRepository } from 'src/modules/customer/infrastructure/repositories/customer.repository';
import { AccountChangeStatusHandler } from '../application/queries/account-change-status.handler';
import { AccountOpenHandler } from '../application/queries/account-open.handler';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/modules/shared/guards/auth.guard';
import {
  TOKEN_SERVICE,
  TokenService,
} from 'src/modules/shared/services/token.service';

@Module({
  imports: [
    JwtModule,
    CqrsModule,
    TypeOrmModule.forFeature([CustomerEntity, AccountEntity]),
  ],
  controllers: [AccountController],
  providers: [
    JwtService,
    { provide: TOKEN_SERVICE, useClass: TokenService },
    { provide: ACCOUNT_REPOSITORY, useClass: AccountRepository },
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepository },
    AccountChangeStatusHandler,
    AccountOpenHandler,
    AuthGuard,
  ],
})
export class AccountModule {}
