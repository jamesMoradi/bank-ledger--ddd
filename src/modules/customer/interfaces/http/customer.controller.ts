import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomerRegisterDto } from '../dtos/customer-register.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CustomerLoginDto } from '../dtos/customer-login';
import { CustomerUpdateDto } from '../dtos/customer-update.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CustomerRegisterCommand } from '../../application/commands/customer-register.command';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerLoginCommand } from '../../application/commands/customer-login.command';
import { CustomerUpdateEmailCommand } from '../../application/commands/customer-update-email.command';
import { CustomerUpdateFullNameCommand } from '../../application/commands/customer-update-full-name.command';
import { CustomerUpdatePasswordCommand } from '../../application/commands/customer-update-password.command';
import { Request } from 'express';
import { CustomerUnAuthorizedError } from 'src/modules/shared/domain/errors/unauthorized.error';
import { GetAllCustomersQuery } from '../../application/queries/get-all-customers.query';
import { AuthGuard } from 'src/modules/shared/guards/auth.guard';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAll(): Promise<Customer[]> {
    return this.queryBus.execute(new GetAllCustomersQuery());
  }

  @Post('register')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async register(@Body() dto: CustomerRegisterDto): Promise<Customer> {
    const cmd = new CustomerRegisterCommand(
      dto.email,
      dto.nationalId,
      dto.fullName,
      dto.password,
    );
    return this.commandBus.execute(cmd);
  }

  @Post('login')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  async login(@Body() dto: CustomerLoginDto): Promise<{ token: string }> {
    const cmd = new CustomerLoginCommand(dto.email, dto.password);
    return this.commandBus.execute(cmd);
  }

  @Patch()
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  @UseGuards(AuthGuard)
  async update(@Req() request: Request, @Body() dto: CustomerUpdateDto) {
    const { email, password, fullName } = dto;
    const { customerId } = request;

    if (!customerId)
      throw new CustomerUnAuthorizedError('customer is not authorized');

    if (email) {
      const updateEmailCmd = new CustomerUpdateEmailCommand(email, customerId);
      await this.commandBus.execute(updateEmailCmd);
    }
    if (fullName) {
      const updateFullNameCmd = new CustomerUpdateFullNameCommand(
        fullName,
        customerId,
      );
      await this.commandBus.execute(updateFullNameCmd);
    }
    if (password) {
      const updatePasswordCmd = new CustomerUpdatePasswordCommand(
        password,
        customerId,
      );
      await this.commandBus.execute(updatePasswordCmd);
    }

    return { message: 'profile updated successfully' };
  }
}
