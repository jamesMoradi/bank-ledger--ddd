import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/modules/accounts/infrastructure/entities/account.entity';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entities/customer.entity';
import { DepositEntity } from 'src/modules/transaction/infrastructure/entities/deposit.entity';
import { TransactionEntity } from 'src/modules/transaction/infrastructure/entities/transaction.entity';
import { TransferEntity } from 'src/modules/transaction/infrastructure/entities/transfer.entity';
import { WithdrawEntity } from 'src/modules/transaction/infrastructure/entities/withdraw.entity';

export class TypeormConfig {
  static forRoot = () =>
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        database: configService.get<string>('DB_NAME'),
        password: configService.get<string>('DB_PASSWORD'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        entities: [
          CustomerEntity,
          AccountEntity,
          TransactionEntity,
          WithdrawEntity,
          TransferEntity,
          DepositEntity,
          'dist/**/**/**/**/*.entity{.ts,.js}',
          'dist/**/**/**/*.entity{.ts,.js}',
        ],
        synchronize: true,
      }),
    });
}
