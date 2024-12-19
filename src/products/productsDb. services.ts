import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/Products.entity';
import { Category } from '../entities/Categories.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async addProducts(products: any[]): Promise<void> {
    for (const product of products) {
      const existingProduct = await this.productRepository.findOne({
        where: { name: product.name },
      });
      if (!existingProduct) {
        const category = await this.categoryRepository.findOne({
          where: { name: product.category },
        });
        if (category) {
          const newProduct = this.productRepository.create({
            ...product,
            category: category,
          });
          await this.productRepository.save(newProduct);
        }
      }
    }
  }
  async getProducts(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category'] });
  }
}
