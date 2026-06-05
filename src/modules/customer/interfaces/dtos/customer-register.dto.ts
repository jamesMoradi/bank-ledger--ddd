import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CustomerRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @MinLength(9)
  nationalId: string;
}
