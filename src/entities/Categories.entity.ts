import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './Products.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {
  @ApiProperty({
    example: 'b4f2e74d-8d2f-4c5a-b0e7-9c9a2f3dcd11',
    description: 'ID único de la categoría',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Electrónica',
    description: 'Nombre de la categoría',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ApiProperty({
    type: [Product],
    description: 'Productos asociados a esta categoría',
  })
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
