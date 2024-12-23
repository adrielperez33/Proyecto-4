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
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'El nombre no debe exceder los 80 caracteres' })
  name: string;

  @IsEmail(
    {},
    { message: 'Debe ser una dirección de correo electrónico válida' },
  )
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message:
      'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)',
  })
  password: string;

  @IsString()
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'La dirección no debe exceder los 80 caracteres' })
  address: string;

  @IsNumber({}, { message: 'El teléfono debe ser un número' })
  @IsNotEmpty({ message: 'El teléfono no puede estar vacío' })
  phone: number;

  @IsString()
  @IsNotEmpty({ message: 'El país no puede estar vacío' })
  @MinLength(5, { message: 'El país debe tener al menos 5 caracteres' })
  @MaxLength(20, { message: 'El país no debe exceder los 20 caracteres' })
  country: string;

  @IsString()
  @IsNotEmpty({ message: 'La ciudad no puede estar vacía' })
  @MinLength(5, { message: 'La ciudad debe tener al menos 5 caracteres' })
  @MaxLength(20, { message: 'La ciudad no debe exceder los 20 caracteres' })
  city: string;
}
