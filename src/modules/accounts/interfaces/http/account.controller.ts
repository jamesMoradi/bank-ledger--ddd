import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/shared/guards/auth.guard';
import { Request } from 'express';
import { CustomerUnAuthorizedError } from 'src/modules/shared/domain/errors/unauthorized.error';
import { AccountOpenCommand } from '../../application/commands/account-open.command';
import { AccountOpenDto } from '../dto/account-open.dto';

@ApiTags('Account')
@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  openAccount(@Req() request: Request, @Body() dto: AccountOpenDto) {
    const { customerId } = request;
    if (!customerId)
      throw new CustomerUnAuthorizedError('customer unauthorized');

    return this.commandBus.execute(
      new AccountOpenCommand(customerId, dto.currency),
    );
  }
}
