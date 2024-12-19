import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('seeder')
  async preloadCategories(): Promise<void> {
    const categories = [
      { name: 'smartphone' },
      { name: 'monitor' },
      { name: 'keyboard' },
      { name: 'mouse' },
    ];
    await this.categoryService.addCategories(categories);
  }

  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }
}
