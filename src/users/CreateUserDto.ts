import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(80, { message: 'Name must not exceed 80 characters' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)',
  })
  password: string;

  @IsString()
  @MinLength(3, { message: 'Address must be at least 3 characters long' })
  @MaxLength(80, { message: 'Address must not exceed 80 characters' })
  address: string;

  @IsNumber()
  @IsNotEmpty()
  phone: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Country must be at least 5 characters' })
  @MaxLength(20, { message: 'Country must not exceed 20 characters' })
  country: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'City must be at least 5 characters' })
  @MaxLength(20, { message: 'City must not exceed 20 characters' })
  city: string;
}
