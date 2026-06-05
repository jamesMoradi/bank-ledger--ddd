import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllCustomersQuery } from './get-all-customers.query';
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../domain/repositories/customer.repository';
import { Customer } from '../../domain/entities/customer.entity';

@QueryHandler(GetAllCustomersQuery)
export class GetAllCustomersHandler implements IQueryHandler<GetAllCustomersQuery> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}
