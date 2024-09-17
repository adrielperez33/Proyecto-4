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

  async getProducts({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<Product[]> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return this.products.slice(startIndex, endIndex);
  }

  async getProductsId(id: number) {
    return this.products.find((products) => products.id === id);
  }

  async createProducts(product: Omit<Product, 'id'>): Promise<number> {
    const id = this.products.length + 1;
    this.products = [...this.products, { id, ...product }];
    return id;
  }

  async putProduct(
    id: number,
    product: Partial<Product>,
  ): Promise<number | undefined> {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );
    if (productIndex === -1) {
      return undefined;
    }
    const newProduct = { ...this.products[productIndex], ...product };
    this.products[productIndex] = newProduct;
    return id;
  }

  async deleteProducts(id: number): Promise<number> {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }
    this.products.splice(productIndex, 1);
    return id;
  }
}
