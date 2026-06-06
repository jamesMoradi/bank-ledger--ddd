import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CustomerUpdateDto {
  @IsOptional()
  @ApiProperty({ example: 'johndoe2@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @ApiProperty({ example: '9876543210' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password?: string;

  @IsOptional()
  @ApiProperty({ example: 'John Dwayne ii' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  fullName?: string;
}
