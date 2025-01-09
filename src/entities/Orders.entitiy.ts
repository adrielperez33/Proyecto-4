import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './Users.entitiy';
import { OrderDetail } from './OrderDetail.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('orders')
export class Order {
  @ApiProperty({
    example: 'b4f2e74d-8d2f-4c5a-b0e7-9c9a2f3dcd11',
    description: 'ID de la orden',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    type: User,
    description: 'Usuario que realizó la orden',
  })
  @ManyToOne(() => User, (user) => user.orders, { eager: true }) // Cargar usuarios automáticamente
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    example: 1599.99,
    description: 'Total de la orden',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ApiProperty({
    example: '2025-01-01T10:00:00Z',
    description: 'Fecha de creación de la orden',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @ApiProperty({
    type: [OrderDetail],
    description: 'Detalles de los productos en la orden',
  })
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true, // Permite que los detalles se guarden automáticamente
  })
  orderDetails: OrderDetail[];
}
