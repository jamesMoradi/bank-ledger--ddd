import { FraudRules } from '../../shared/enums/fraud-rules.enum';

export class FraudDetectedEvent {
  constructor(
    public readonly fraudId: string,
    public readonly accountId: string,
    public readonly customerId: string,
    public readonly rule: FraudRules,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
