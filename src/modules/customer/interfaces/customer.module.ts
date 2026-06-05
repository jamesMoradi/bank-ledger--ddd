import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '../infrastructure/entities/customer.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CustomerController } from './http/customer.controller';
import { CUSTOMER_REPOSITORY } from '../domain/repositories/customer.repository';
import { CustomerRepository } from '../infrastructure/repositories/customer.repository';
import {
  TOKEN_SERVICE,
  TokenService,
} from 'src/modules/shared/services/token.service';
import {
  PASSWORD_HASHER_SERVICE,
  PasswordHasher,
} from 'src/modules/shared/services/password-hasher.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GetAllCustomersHandler } from '../application/queries/get-all-customer.handler';
import { GetCustomerByIdHandler } from '../application/queries/get-customer-by-id.handler';
import { CustomerLoginHandler } from '../application/queries/customer-login.handler';
import { CustomerRegisterHandler } from '../application/queries/customer-register.handler';
import { CustomerUpdateEmailHandler } from '../application/queries/customer-update-email.handler';
import { CustomerUpdatePasswordHandler } from '../application/queries/customer-update-password.handler';
import { CustomerUpdateFullNameHandler } from '../application/queries/customer-update-full-name.handler';
import { AuthGuard } from 'src/modules/shared/guards/auth.guard';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomerController],
  providers: [
    ConfigService,
    JwtService,
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepository },
    { provide: TOKEN_SERVICE, useClass: TokenService },
    { provide: PASSWORD_HASHER_SERVICE, useClass: PasswordHasher },
    AuthGuard,
    GetAllCustomersHandler,
    GetCustomerByIdHandler,
    CustomerLoginHandler,
    CustomerRegisterHandler,
    CustomerUpdateEmailHandler,
    CustomerUpdatePasswordHandler,
    CustomerUpdateFullNameHandler,
  ],
})
export class CustomerModule {}
