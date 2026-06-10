import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CustomerUnAuthorizedError } from 'src/modules/shared/domain/errors/unauthorized.error';
import { AccountOpenCommand } from '../../application/commands/account-open.command';
import { AccountOpenDto } from '../dto/account-open.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { AccountChangeStatusCommand } from '../../application/commands/account-change-status.command';
import { AccountChangeStatusDto } from '../dto/account-change-status.dto';
import { IResponse } from 'src/modules/shared/response/success.response';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@ApiTags('Account')
@Controller('account')
@AuthDecorator()
export class AccountController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  openAccount(
    @Req() request: Request,
    @Body() dto: AccountOpenDto,
  ): Promise<IResponse> {
    const { customerId } = request;
    if (!customerId)
      throw new CustomerUnAuthorizedError('customer unauthorized');

    return this.commandBus.execute(
      new AccountOpenCommand(customerId, dto.currency),
    );
  }

  @Patch('/:id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeStatus(
    @Param('id') id: string,
    @Body() dto: AccountChangeStatusDto,
  ): Promise<IResponse> {
    return this.commandBus.execute(
      new AccountChangeStatusCommand(id, dto.status),
    );
  }
}
