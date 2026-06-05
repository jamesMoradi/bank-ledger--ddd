import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CustomerUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  fullName?: string;
}
