import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Laptop Gamer',
    description: 'Nombre del producto',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(50, { message: 'El nombre no debe exceder los 50 caracteres' })
  name: string;

  @ApiProperty({
    example: 'Una laptop potente para gaming y trabajo',
    description: 'Descripción del producto',
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  description: string;

  @ApiProperty({
    example: 1599.99,
    description: 'Precio del producto en dólares',
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor que 0' })
  price: number;

  @ApiProperty({
    example: 10,
    description: 'Cantidad disponible en stock',
  })
  @Type(() => Number)
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @ApiProperty({
    example: 'https://example.com/product-image.jpg',
    description: 'URL de la imagen del producto',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La URL de la imagen no debe exceder los 255 caracteres',
  })
  imgUrl?: string;

  @ApiProperty({
    example: 'Electrónica',
    description: 'Categoría a la que pertenece el producto',
  })
  @IsString()
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  category: string; // Se espera el nombre de la categoría
}
