import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/Categories.entity';
import { log } from 'console';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async addCategories(categories: { name: string }[]): Promise<void> {
    for (const category of categories) {
      const categoryExists = await this.categoryRepository.findOne({
        where: { name: category.name },
      });
      if (!categoryExists) {
        const newCategory = this.categoryRepository.create(category);
        await this.categoryRepository.save(newCategory);
        console.log('categorias cargadas correctamente');
      }
      console.log('las categorias ya estan precargadas');
    }
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }
}
