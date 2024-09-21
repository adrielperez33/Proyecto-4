import { Categorie } from 'src/categories/categories.entity';
import { OrderDetail } from 'src/ordersDetails/ordersDetails.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({
    type: 'text',
    default:
      'https://cdn.icon-icons.com/icons2/2633/PNG/96/office_gallery_image_picture_icon_159182.png',
  })
  imgUrl: string;

  @ManyToOne(() => Categorie, (category) => category.products)
  category: Categorie;

  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
  @JoinTable()
  orderDetails: OrderDetail[];
}
