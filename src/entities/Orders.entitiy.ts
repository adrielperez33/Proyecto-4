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

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { eager: true }) // Cargar usuarios automáticamente
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true, // Permite que los detalles se guarden automáticamente
  })
  orderDetails: OrderDetail[];
}
