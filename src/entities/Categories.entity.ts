import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './Products.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string; // UUID como clave primaria

  @Column({ length: 50 })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]; // Relación 1:N con Products
}
