import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '../entities/account.entity';
import { Repository } from 'typeorm';
import { IAccountRepository } from '../../domain/repositories/account.repository';
import { Account } from '../../domain/entities/account.entity';
import { AccountMapper } from '../mapper/account.mapper';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly repository: Repository<AccountEntity>,
  ) {}

  async findById(id: string): Promise<Account | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async save(account: Account): Promise<Account> {
    const savedAccount = await this.repository.save(
      AccountMapper.toEntity(account),
    );
    return AccountMapper.toDomain(savedAccount);
  }
}
