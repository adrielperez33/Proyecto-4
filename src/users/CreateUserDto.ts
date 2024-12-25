import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  Matches,
  IsInt,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(50, { message: 'El nombre no debe exceder los 50 caracteres' })
  name: string;

  @IsEmail(
    {},
    { message: 'Debe ser una dirección de correo electrónico válida' },
  )
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  @MaxLength(50, {
    message: 'El correo electrónico no debe exceder los 50 caracteres',
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/, {
    message:
      'La contraseña debe tener entre 8 y 20 caracteres, e incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%^&*)',
  })
  @MaxLength(20, { message: 'La contraseña no debe exceder los 20 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'La confirmación de contraseña no puede estar vacía' })
  @MaxLength(20, {
    message: 'La confirmación de contraseña no debe exceder los 20 caracteres',
  })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
  @MaxLength(100, {
    message: 'La dirección no debe exceder los 100 caracteres',
  })
  address: string;

  @IsInt({ message: 'El teléfono debe ser un número entero' })
  @IsNotEmpty({ message: 'El teléfono no puede estar vacío' })
  phone: number;

  @IsString()
  @IsNotEmpty({ message: 'El país no puede estar vacío' })
  @MaxLength(50, { message: 'El país no debe exceder los 50 caracteres' })
  country: string;

  @IsString()
  @IsNotEmpty({ message: 'La ciudad no puede estar vacía' })
  @MaxLength(50, { message: 'La ciudad no debe exceder los 50 caracteres' })
  city: string;
}
