import { Injectable } from '@nestjs/common';
import { Products } from 'src/entities/Products.entity';

@Injectable()
export class ProductsRepository {
  private products: Products[] = [
    {
      id: 1,
      name: 'Product 1',
      description: 'Description for product 1',
      price: 29.99,
      stock: true,
      imgUrl: 'https://example.com/product1.jpg',
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'Description for product 2',
      price: 49.99,
      stock: false,
      imgUrl: 'https://example.com/product2.jpg',
    },
  ];
  getProducts(): Products[] {
    return this.products;
  }
}
