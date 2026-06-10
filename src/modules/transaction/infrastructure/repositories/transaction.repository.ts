import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { TransactionEntity } from '../entities/transaction.entity';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { WithdrawEntity } from '../entities/withdraw.entity';
import { TransferEntity } from '../entities/transfer.entity';
import { DepositEntity } from '../entities/deposit.entity';
import { BadRequestError } from 'src/modules/shared/domain/errors/bad-request.error';
import { TransactionStatus } from '../../shared/enums/transaction.status-enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,

    @InjectRepository(WithdrawEntity)
    private readonly withdrawRepository: Repository<WithdrawEntity>,

    @InjectRepository(TransferEntity)
    private readonly transferRepository: Repository<TransferEntity>,

    @InjectRepository(DepositEntity)
    private readonly depositRepository: Repository<DepositEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async findAllByAccountId(accountId: string): Promise<Transaction[]> {
    const entities = await this.transactionRepository.find({
      where: { accountId },
      relations: {
        transfer: true,
        deposit: true,
        withdraw: true,
      },
    });

    return entities.map((entity) =>
      TransactionMapper.toDomain(
        entity,
        entity.deposit || entity.withdraw || entity.transfer,
      ),
    );
  }

  async findByAccountIdAndType(
    accountId: string,
    type: TransactionType,
    since: Date,
  ): Promise<Transaction[]> {
    const entities = await this.transactionRepository.find({
      where: {
        accountId,
        type,
        createdAt: MoreThanOrEqual(since),
      },
      relations: {
        transfer: true,
        deposit: true,
        withdraw: true,
      },
    });

    return entities.map((entity) =>
      TransactionMapper.toDomain(
        entity,
        entity.deposit || entity.withdraw || entity.transfer,
      ),
    );
  }

  async findFailedTransfersByAccountId(
    accountId: string,
    limit: number,
  ): Promise<Transaction[]> {
    const entities = await this.transactionRepository.find({
      where: {
        accountId,
        status: TransactionStatus.FAILED,
        type: TransactionType.TRANSFER_OUT,
      },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: {
        transfer: true,
      },
    });

    return entities.map((entity) =>
      TransactionMapper.toDomain(entity, entity.transfer),
    );
  }

  async getById(id: string): Promise<Transaction | null> {
    const entity = await this.transactionRepository.findOne({
      where: { id },
      relations: {
        transfer: true,
        withdraw: true,
        deposit: true,
      },
    });

    return entity
      ? TransactionMapper.toDomain(
          entity,
          entity.deposit || entity.withdraw || entity.transfer,
        )
      : null;
  }

  async sumWithdrawalsByAccountIdSince(
    accountId: string,
    since: Date,
  ): Promise<number> {
    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .innerJoin('transaction.withdraw', 'withdraw')
      .select('COALESCE(SUM(withdraw.amount), 0)', 'total')
      .where('transaction.accountId = :accountId', { accountId })
      .andWhere('transaction.type = :type', { type: TransactionType.WITHDRAW })
      .andWhere('transaction.createdAt >= :since', { since })
      .getRawOne<{ total: string }>();

    return parseFloat(result?.total ?? '0');
  }

  async save(transaction: Transaction): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const txEntity = TransactionMapper.toTransactionEntity(transaction);

      await queryRunner.manager.save(TransactionEntity, txEntity);

      switch (transaction.type) {
        case TransactionType.DEPOSIT:
          await queryRunner.manager.save(
            DepositEntity,
            TransactionMapper.toDepositEntity(transaction),
          );
          break;

        case TransactionType.WITHDRAW:
          await queryRunner.manager.save(
            WithdrawEntity,
            TransactionMapper.toWithDrawEntity(transaction),
          );
          break;

        case TransactionType.TRANSFER_OUT:
          await queryRunner.manager.save(
            TransferEntity,
            TransactionMapper.toTransferEntity(transaction),
          );
          break;

        default:
          throw new BadRequestError('Unsupported transaction type');
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
