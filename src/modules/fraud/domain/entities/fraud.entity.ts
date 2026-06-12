import { FraudRules } from '../../shared/enums/fraud-rules.enum';
import { FraudStatus } from '../value-objects/fraud-status.vo';
import { FraudStatus as FraudStatusEnum } from '../../shared/enums/fraud-status.enum';
import { BadRequestError } from 'src/modules/shared/domain/errors/bad-request.error';
import { FraudResolvedEvent } from '../events/fraud-resolved.event';
import { FraudDetectedEvent } from '../events/fraud-detected.event';

export class Fraud {
  private readonly _id: string;
  private readonly _accountId: string;
  private readonly _customerId: string;
  private _status: FraudStatus;
  private readonly _rule: FraudRules;
  private readonly _triggeredAt: Date;
  private _resolvedAt: Date | null;
  private _domainEvents: object[];

  private constructor(
    id: string,
    accountId: string,
    customerId: string,
    status: FraudStatus,
    rule: FraudRules,
    triggeredAt: Date,
    resolvedAt: Date | null,
  ) {
    this._id = id;
    this._accountId = accountId;
    this._customerId = customerId;
    this._status = status;
    this._rule = rule;
    this._triggeredAt = triggeredAt;
    this._resolvedAt = resolvedAt;
    this._domainEvents = [];
  }

  static create(props: {
    id: string;
    accountId: string;
    customerId: string;
    rule: FraudRules;
  }): Fraud {
    const fraud = new Fraud(
      props.id,
      props.accountId,
      props.customerId,
      FraudStatus.create(FraudStatusEnum.OPEN),
      props.rule,
      new Date(),
      null,
    );

    // fires here — account module and notification module will react
    fraud.addEvent(
      new FraudDetectedEvent(
        fraud._id,
        fraud._accountId,
        fraud._customerId,
        fraud._rule,
      ),
    );

    return fraud;
  }

  static reconstitute(props: {
    id: string;
    accountId: string;
    customerId: string;
    rule: FraudRules;
    status: FraudStatusEnum;
    triggeredAt: Date;
    resolvedAt: Date | null;
  }): Fraud {
    return new Fraud(
      props.id,
      props.accountId,
      props.customerId,
      FraudStatus.create(props.status),
      props.rule,
      props.triggeredAt,
      props.resolvedAt,
    );
  }

  get id(): string {
    return this._id;
  }

  get accountId(): string {
    return this._accountId;
  }

  get status(): FraudStatus {
    return this._status;
  }

  get rule(): FraudRules {
    return this._rule;
  }

  get triggeredAt(): Date {
    return this._triggeredAt;
  }

  get resolvedAt(): Date | null {
    return this._resolvedAt;
  }

  get customerId(): string {
    return this._customerId;
  }

  resolve(): void {
    if (this._status.isResolved()) {
      throw new BadRequestError('Fraud alert is already resolved');
    }
    this._status = FraudStatus.create(FraudStatusEnum.RESOLVED);
    this._resolvedAt = new Date();
    this.addEvent(
      new FraudResolvedEvent(this._id, this._accountId, this._customerId),
    );
  }

  private addEvent(event: object): void {
    this._domainEvents.push(event);
  }

  pullEvents(): object[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
