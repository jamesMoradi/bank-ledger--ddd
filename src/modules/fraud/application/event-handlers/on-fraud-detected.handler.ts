import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from 'src/modules/accounts/domain/repositories/account.repository';
import { FraudDetectedEvent } from '../../domain/events/fraud-detected.event';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OnFraudDetectedHandler {
  private readonly logger = new Logger(OnFraudDetectedHandler.name);

  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    private readonly eventBus: EventBus,
  ) {}

  @OnEvent(FraudDetectedEvent.name)
  async handle(event: FraudDetectedEvent): Promise<void> {
    const account = await this.accountRepository.findById(event.accountId);
    if (!account) {
      this.logger.error(
        `account ${event.accountId} not found during fraud freeze`,
      );
      return;
    }

    account.freeze();
    await this.accountRepository.save(account);

    account.pullEvents().forEach((e) => {
      this.eventBus.publish(e);
    });

    this.logger.warn(`account ${event.accountId} frozen due to fraud`);
  }
}
