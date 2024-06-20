import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository'; 
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  getAllProducts(): Product[] {
    return this.productRepository.getAll();
  }
}
