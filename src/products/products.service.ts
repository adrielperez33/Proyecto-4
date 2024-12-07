import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Products } from 'src/entities/Products.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async getProducts(page: number, limit: number): Promise<Products[]> {
    return this.productsRepository.getProducts(page, limit);
  }

  getProductsId(id: number): Products | undefined {
    return this.productsRepository.getProductsId(id);
  }

  postProducts(product: Omit<Products, 'id'>): number {
    return this.productsRepository.postProducts(product);
  }

  putProducts(
    id: number,
    user: Partial<Omit<Products, 'id' | 'password'>>,
  ): number {
    return this.productsRepository.putProducts(id, user);
  }

  deleteProducts(id: number) {
    return this.productsRepository.deleteProducts(id);
  }
}
