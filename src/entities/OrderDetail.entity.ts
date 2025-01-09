import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Order } from './Orders.entitiy';
import { Product } from './Products.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('order_details')
export class OrderDetail {
  @ApiProperty({
    example: 'a1b2c3d4-5678-90ef-gh12-3456789ijkl',
    description: 'ID del detalle de la orden',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 1599.99,
    description: 'Precio del producto en la orden',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    type: Order,
    description: 'Orden asociada a este detalle',
  })
  @ManyToOne(() => Order, (order) => order.orderDetails, {
    onDelete: 'CASCADE', // Elimina detalles si la orden es eliminada
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({
    type: [Product],
    description: 'Productos asociados a este detalle de orden',
  })
  @ManyToMany(() => Product, (product) => product.orderDetails)
  @JoinTable({
    name: 'order_details_products',
    joinColumn: { name: 'order_detail_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: Product[];
}
