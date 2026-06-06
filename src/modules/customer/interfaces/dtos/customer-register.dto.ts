import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CustomerRegisterDto {
  @ApiProperty({ example: 'johnDoe@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;

  @ApiProperty({ example: 'John Doe iii' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: '12345678901' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @MinLength(9)
  nationalId: string;
}
