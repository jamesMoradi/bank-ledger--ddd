import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Currencies } from 'src/common/enums/currency.enum';

export class AccountOpenDto {
  @IsNotEmpty()
  @IsEnum(Currencies)
  @ApiProperty({ enum: Currencies, example: Currencies.EUR })
  currency: Currencies;
}
