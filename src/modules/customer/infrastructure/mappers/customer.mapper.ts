import { Customer } from '../../domain/entities/customer.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { FullName } from '../../domain/value-objects/full-name.vo';
import { HashPassword } from '../../domain/value-objects/hash-password.vo';
import { NationalId } from '../../domain/value-objects/national-id.vo';
import { CustomerEntity } from '../entities/customer.entity';

export class CustomerMapper {
  static toEntity(core: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.email = core.email.value;
    entity.hashedPassword = core.hashPassword.value;
    entity.nationalId = core.nationalId.value;
    entity.fullName = core.fullName.value;
    entity.id = core.id;
    return entity;
  }

  static toCore(entity: CustomerEntity): Customer {
    return new Customer(
      entity.id,
      Email.create(entity.email),
      HashPassword.create(entity.hashedPassword),
      NationalId.create(entity.nationalId),
      FullName.create(entity.fullName),
    );
  }
}
