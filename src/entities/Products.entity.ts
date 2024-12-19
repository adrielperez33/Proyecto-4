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

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string; // UUID como clave primaria

  @Column({ length: 50 })
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column({ length: 255, default: 'default-image.jpg' })
  imgUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category; // Relación 1:N con Category

  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  @JoinTable()
  orderDetails: OrderDetail[]; // Relación N:N con OrderDetails
}
