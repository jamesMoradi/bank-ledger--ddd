import { Customer } from '../entities/customer.entity';

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface ICustomerRepository {
  findById(id: string): Promise<null | Customer>;
  findByEmail(email: string): Promise<null | Customer>;
  findByNationalId(nationalId: string): Promise<null | Customer>;
  findAll(): Promise<Customer[]>;
  save(customer: Customer): Promise<Customer>;
}
