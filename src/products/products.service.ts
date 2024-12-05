import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Products } from 'src/entities/Products.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  getProducts(): Products[] {
    return this.productsRepository.getProducts();
  }
}
