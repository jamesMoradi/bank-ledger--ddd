import { Injectable } from '@nestjs/common';
import { ICustomerRepository } from '../../domain/repositories/customer.repository';
import { Customer } from '../../domain/entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { Repository } from 'typeorm';
import { CustomerMapper } from '../mappers/customer.mapper';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}

  async findAll(): Promise<Customer[]> {
    const entities = await this.repository.find();
    const cors = entities.map((core) => CustomerMapper.toCore(core));
    return cors;
  }

  async findByEmail(email: string): Promise<null | Customer> {
    const entity = await this.repository.findOneBy({ email });
    return entity ? CustomerMapper.toCore(entity) : null;
  }

  async findById(id: string): Promise<null | Customer> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? CustomerMapper.toCore(entity) : null;
  }

  async findByNationalId(nationalId: string): Promise<null | Customer> {
    const entity = await this.repository.findOneBy({ nationalId });
    return entity ? CustomerMapper.toCore(entity) : null;
  }

  async findCustomerWithAccount(id: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: { accounts: true },
    });
    return entity ? CustomerMapper.toCore(entity) : null;
  }

  async save(customer: Customer): Promise<Customer> {
    const entity = CustomerMapper.toEntity(customer);
    const core = await this.repository.save({
      email: entity.email,
      fullName: entity.fullName,
      hashedPassword: entity.hashedPassword,
      nationalId: entity.nationalId,
    });
    return CustomerMapper.toCore(core);
  }
}
