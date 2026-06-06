import { IsEnum, IsNotEmpty } from 'class-validator';
import { Currencies } from 'src/common/enums/currency.enum';

export class AccountOpenDto {
  @IsNotEmpty()
  @IsEnum(Currencies)
  currency: Currencies;
}
