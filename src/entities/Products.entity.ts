import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from './Categories.entity';
import { OrderDetail } from './OrderDetail.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({
    example: 'b4f2e74d-8d2f-4c5a-b0e7-9c9a2f3dcd11',
    description: 'ID del producto',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Smartphone',
    description: 'Nombre del producto',
  })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({
    example: 'Descripción del producto',
    description: 'Descripción detallada del producto',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    example: 999.99,
    description: 'Precio del producto',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Stock disponible',
  })
  @Column('int')
  stock: number;

  @ApiProperty({
    example: 'default-image.jpg',
    description: 'URL de la imagen del producto',
  })
  @Column({ length: 255, default: 'default-image.jpg' })
  imgUrl: string;

  @ApiProperty({
    type: Category,
    description: 'Categoría a la que pertenece este producto',
  })
  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @ApiProperty({
    type: [OrderDetail],
    description: 'Detalles de orden asociados a este producto',
  })
  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
  orderDetails: OrderDetail[];
  orderDetailsProducts: boolean;
}
