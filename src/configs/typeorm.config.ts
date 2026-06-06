import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/modules/accounts/infrastructure/entities/account.entity';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entities/customer.entity';

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
          'dist/**/**/**/**/*.entity{.ts,.js}',
          'dist/**/**/**/*.entity{.ts,.js}',
        ],
        synchronize: true,
      }),
    });
}
