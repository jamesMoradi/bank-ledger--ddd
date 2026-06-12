import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { WithdrawEntity } from './entities/withdraw.entity';
import { TransferEntity } from './entities/transfer.entity';
import { DepositEntity } from './entities/deposit.entity';
import { AccountModule } from 'src/modules/accounts/interfaces/account.module';
import { TransactionController } from '../interface/http/transaction.controller';
import {
  TOKEN_SERVICE,
  TokenService,
} from 'src/modules/shared/services/token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/modules/shared/guards/auth.guard';
import { TRANSACTION_REPOSITORY } from '../domain/repositories/transaction.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { WithdrawHandler } from '../application/queries/withdraw.command';
import { DepositHandler } from '../application/queries/deposit.command';
import { TransferHandler } from '../application/queries/transfer.command';
import { GetAllByACcountIdQuery } from '../application/queries/get-all-by-account-id.query';
import { FindSumWithdrawalsByAccountIdSinceQuery } from '../application/queries/get-sum-with-drawas-By-account-id-since.query';
import { GetOneByIdQuery } from '../application/queries/get-one-by-id.query';
import { GetFiledByAccountIdQuery } from '../application/queries/get-failed.query';
import { GetByAccountIdAndTypeQuery } from '../application/queries/get-by-accountId-and-type.query';
import { TransactionEventHandlerModule } from '../application/event-handlers/event-handler.module';

@Module({
  imports: [
    CqrsModule,
    AccountModule,
    TypeOrmModule.forFeature([
      TransactionEntity,
      WithdrawEntity,
      TransferEntity,
      DepositEntity,
    ]),
    JwtModule,
    TransactionEventHandlerModule,
  ],
  controllers: [TransactionController],
  providers: [
    JwtService,
    { provide: TOKEN_SERVICE, useClass: TokenService },
    AuthGuard,
    { provide: TRANSACTION_REPOSITORY, useClass: TransactionRepository },
    WithdrawHandler,
    DepositHandler,
    TransferHandler,
    GetAllByACcountIdQuery,
    FindSumWithdrawalsByAccountIdSinceQuery,
    GetOneByIdQuery,
    GetFiledByAccountIdQuery,
    GetByAccountIdAndTypeQuery,
  ],
})
export class TransactionModule {}
