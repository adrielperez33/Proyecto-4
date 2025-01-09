import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  Matches,
  IsInt,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del usuario',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(50, { message: 'El nombre no debe exceder los 50 caracteres' })
  name: string;

  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Correo electrónico del usuario',
    maxLength: 50,
  })
  @IsEmail(
    {},
    { message: 'Debe ser una dirección de correo electrónico válida' },
  )
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  @MaxLength(50, {
    message: 'El correo electrónico no debe exceder los 50 caracteres',
  })
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/, {
    message:
      'La contraseña debe tener entre 8 y 20 caracteres, e incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%^&*)',
  })
  @MaxLength(20, { message: 'La contraseña no debe exceder los 20 caracteres' })
  password: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Confirmación de la contraseña del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'La confirmación de contraseña no puede estar vacía' })
  @MaxLength(20, {
    message: 'La confirmación de contraseña no debe exceder los 20 caracteres',
  })
  confirmPassword: string;

  @ApiProperty({
    example: 'Av. Siempre Viva 123',
    description: 'Dirección del usuario',
    maxLength: 80,
  })
  @IsString()
  @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
  @MaxLength(80, {
    message: 'La dirección no debe exceder los 100 caracteres',
  })
  address: string;

  @ApiProperty({
    example: 123456789,
    description: 'Número de teléfono del usuario',
  })
  @IsInt({ message: 'El teléfono debe ser un número entero' })
  @IsNotEmpty({ message: 'El teléfono no puede estar vacío' })
  phone: number;

  @ApiProperty({
    example: 'México',
    description: 'País del usuario',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'El país no puede estar vacío' })
  @MaxLength(20, { message: 'El país no debe exceder los 50 caracteres' })
  country: string;

  @ApiProperty({
    example: 'Ciudad de México',
    description: 'Ciudad del usuario',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'La ciudad no puede estar vacía' })
  @MaxLength(20, { message: 'La ciudad no debe exceder los 50 caracteres' })
  city: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el usuario tiene permisos de administrador',
  })
  @IsBoolean()
  @IsOptional()
  admin?: boolean;
}
