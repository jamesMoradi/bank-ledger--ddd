import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { Currencies } from 'src/common/enums/currency.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MakeTransactionDto {
  @ApiProperty({ example: TransactionType.DEPOSIT })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 5000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10_000)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ example: Currencies.EUR })
  @IsNotEmpty()
  @IsEnum(Currencies)
  currency: Currencies;

  @ApiProperty({ example: '168a312a-0e92-40da-ac3f-69a940cefbc1' })
  @IsOptional()
  @IsUUID()
  receiverAccountId?: string;
}
