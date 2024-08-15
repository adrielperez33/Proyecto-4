import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop',
      description: 'A high performance laptop',
      price: 999.99,
      stock: true,
      imgUrl: 'http://example.com/laptop.jpg',
    },
    {
      id: 2,
      name: 'Phone',
      description: 'A smartphone with a great camera',
      price: 699.99,
      stock: true,
      imgUrl: 'http://example.com/phone.jpg',
    },
  ];

  getAll(): Product[] {
    return this.products;
  }
}
