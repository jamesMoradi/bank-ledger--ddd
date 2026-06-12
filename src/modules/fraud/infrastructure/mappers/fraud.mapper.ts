import { Fraud } from '../../domain/entities/fraud.entity';
import { FraudEntity } from '../entities/fraud.entity';

export class FraudMapper {
  static toEntity(domain: Fraud): FraudEntity {
    const entity = new FraudEntity();
    entity.id = domain.id;
    entity.accountId = domain.accountId;
    entity.customerId = domain.customerId;
    entity.rule = domain.rule;
    entity.status = domain.status.value;
    entity.createdAt = domain.triggeredAt;
    entity.resolvedAt = domain.resolvedAt;
    return entity;
  }

  static toDomain(entity: FraudEntity): Fraud {
    return Fraud.reconstitute({
      id: entity.id,
      accountId: entity.accountId,
      customerId: entity.customerId,
      rule: entity.rule,
      status: entity.status,
      triggeredAt: entity.createdAt,
      resolvedAt: entity.resolvedAt,
    });
  }
}
