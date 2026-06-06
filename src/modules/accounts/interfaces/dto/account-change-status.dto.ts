import { IsEnum, IsNotEmpty } from 'class-validator';
import { AccountStatus } from '../../shared/enums/account-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class AccountChangeStatusDto {
  @IsNotEmpty()
  @IsEnum(AccountStatus)
  @ApiProperty({ enum: AccountStatus, example: AccountStatus.ACTIVE })
  status: AccountStatus;
}
