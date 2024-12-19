import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './Orders.entitiy';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ length: 20 })
  password: string;

  @Column('int')
  phone: number;

  @Column({ length: 50 })
  country: string;

  @Column('text')
  address: string;

  @Column({ length: 50 })
  city: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
