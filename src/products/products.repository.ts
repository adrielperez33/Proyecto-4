import { Injectable } from '@nestjs/common';
import { Product } from './products.entitiy';

@Injectable()
export class ProductsRepository {
  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop',
      description: 'High performance laptop',
      price: 1200,
      stock: true,
      imgUrl: 'https://example.com/laptop.png',
    },
    {
      id: 2,
      name: 'Smartphone',
      description: 'Latest model smartphone',
      price: 800,
      stock: true,
      imgUrl: 'https://example.com/smartphone.png',
    },
  ];

  getProducts() {
    return this.products;
  }
}
