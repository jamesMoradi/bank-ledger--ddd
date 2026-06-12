import { Injectable } from '@nestjs/common';
import { IFraudRepository } from '../../domain/repositories/fraud.repository';
import { Fraud } from '../../domain/entities/fraud.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FraudEntity } from '../entities/fraud.entity';
import { Repository } from 'typeorm';
import { FraudMapper } from '../mappers/fraud.mapper';

@Injectable()
export class FraudRepository implements IFraudRepository {
  constructor(
    @InjectRepository(FraudEntity)
    private readonly repository: Repository<FraudEntity>,
  ) {}

  async findOneById(id: string): Promise<Fraud | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? FraudMapper.toDomain(entity) : null;
  }

  async save(fraud: Fraud): Promise<void> {
    const entity = FraudMapper.toEntity(fraud);
    await this.repository.save(entity);
  }

  async findAll(): Promise<Fraud[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => FraudMapper.toDomain(entity));
  }

  async findByAccountId(accountId: string): Promise<Fraud[]> {
    const entities = await this.repository.find({
      where: { accountId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => FraudMapper.toDomain(entity));
  }
}
