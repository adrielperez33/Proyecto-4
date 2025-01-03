import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Pre-cargar categorías' })
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

  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }
}
