import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'El nombre de la categoría' })
  @IsString() 
  name: string;
}
