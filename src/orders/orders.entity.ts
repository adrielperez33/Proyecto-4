import { OrderDetail } from 'src/ordersDetails/ordersDetails.entity';
import { User } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({ type: 'date' })
  date: string;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order)
  @JoinColumn()
  orderDetails: OrderDetail;
}
