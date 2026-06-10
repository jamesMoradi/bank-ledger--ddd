import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { MakeTransactionDto } from '../dto/make-transaction.domain';
import { DepositCommand } from '../../application/commands/deposit.command';
import { Transaction } from '../../domain/entities/transaction.entity';
import { GetAllByAccountIdCommand } from '../../application/commands/get-all-by-account-id.command';
import { GetFailedByAccountIdCommand } from '../../application/commands/get-failed.command';
import { GetByAccountIdAndTypeCommand } from '../../application/commands/get-by-accountId-and-type.command';
import { GetOneByIdCommand } from '../../application/commands/get-by-id.commands';
import { FindSumWithdrawalsByAccountIdSinceCommand } from '../../application/commands/get-sum-withdraws-By-account-id-since.command';
import { BadRequestError } from 'src/modules/shared/domain/errors/bad-request.error';
import { TransferCommand } from '../../application/commands/transfer.command';
import { WithdrawCommand } from '../../application/commands/withdraw.command';
import { IResponse } from 'src/modules/shared/response/success.response';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@Controller('transaction')
@ApiTags('Transaction')
@AuthDecorator()
export class TransactionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('/:accountId')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  async createTransaction(
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @Body() dto: MakeTransactionDto,
  ): Promise<IResponse> {
    const { amount, currency, receiverAccountId, type } = dto;

    switch (type) {
      case TransactionType.DEPOSIT:
        return this.commandBus.execute<DepositCommand, IResponse>(
          new DepositCommand(accountId, amount, currency),
        );

      case TransactionType.WITHDRAW:
        return this.commandBus.execute<WithdrawCommand, IResponse>(
          new WithdrawCommand(accountId, amount, currency),
        );

      case TransactionType.TRANSFER_OUT:
        if (!receiverAccountId) {
          throw new BadRequestError(
            'receiverAccountId is required for transfers',
          );
        }
        return this.commandBus.execute<TransferCommand, IResponse>(
          new TransferCommand(accountId, amount, currency, receiverAccountId),
        );

      default:
        throw new BadRequestError('Unsupported transaction type');
    }
  }

  @Get('account/:accountId')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  findAllByAccountId(
    @Param('accountId', ParseUUIDPipe) accountId: string,
  ): Promise<Transaction[]> {
    return this.queryBus.execute(new GetAllByAccountIdCommand(accountId));
  }

  @Get('account/:accountId/failed/:limit')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  findFailedTransfers(
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @Param('limit', ParseIntPipe) limit: number,
  ): Promise<Transaction[]> {
    return this.queryBus.execute(
      new GetFailedByAccountIdCommand(accountId, limit),
    );
  }

  @Get('account/:accountId/type/:type/since/:since')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  findByAccountIdAndType(
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @Param('type') type: TransactionType,
    @Param('since') since: string,
  ): Promise<Transaction[]> {
    const sinceDate = new Date(since);
    if (isNaN(sinceDate.getTime())) {
      throw new BadRequestError(
        'Invalid date. Use ISO 8601 format: 2024-01-01',
      );
    }
    return this.queryBus.execute(
      new GetByAccountIdAndTypeCommand(accountId, type, sinceDate),
    );
  }

  @Get('account/:accountId/withdrawals/since/:since')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  findSumWithdrawals(
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @Param('since') since: string,
  ): Promise<{ total: number }> {
    const sinceDate = new Date(since);
    if (isNaN(sinceDate.getTime())) {
      throw new BadRequestError(
        'Invalid date. Use ISO 8601 format: 2024-01-01',
      );
    }
    return this.queryBus.execute(
      new FindSumWithdrawalsByAccountIdSinceCommand(accountId, sinceDate),
    );
  }

  @Get(':id')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  getById(@Param('id', ParseUUIDPipe) id: string): Promise<Transaction> {
    return this.queryBus.execute(new GetOneByIdCommand(id));
  }
}
