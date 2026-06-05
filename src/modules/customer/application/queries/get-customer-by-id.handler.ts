import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerByIdQuery } from './get-customer-by-id.query';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from '../../domain/repositories/customer.repository';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerNotFoundError } from '../../domain/errors/customer-not-found.error';

@QueryHandler(GetCustomerByIdQuery)
export class GetCustomerByIdHandler implements IQueryHandler<GetCustomerByIdQuery> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(query: GetCustomerByIdQuery): Promise<Customer> {
    const customer = await this.customerRepository.findById(query.id);
    if (!customer) {
      throw new CustomerNotFoundError('no user exists');
    }
    return customer;
  }
}
