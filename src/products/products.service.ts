import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from './products.entitiy';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  getProducts(pagination: { page: number; limit: number }) {
    return this.productsRepository.getProducts(pagination);
  }

  getProductsId(id: number) {
    return this.productsRepository.getProductsId(id);
  }

  createProducts(product: Omit<Product, 'id'>): Promise<number> {
    return this.productsRepository.createProducts(product);
  }

  putProduct(
    id: number,
    product: Partial<Product>,
  ): Promise<number | undefined> {
    return this.productsRepository.putProduct(id, product);
  }
  deleteProducts(id: number): Promise<number> {
    return this.productsRepository.deleteProducts(id);
  }
}
