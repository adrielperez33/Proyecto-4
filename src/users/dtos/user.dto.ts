import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  IsOptional,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 15)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
  password: string;

  @IsOptional()
  @IsString()
  @Length(3, 80)
  address?: string;

  @IsNotEmpty()
  @IsInt()
  phone: number;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  country?: string;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  city?: string;
}
