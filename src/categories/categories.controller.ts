import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Categorie } from './categories.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesServices: CategoriesService) {}

  @Get('seeder')
  async getCategories() {
    return this.categoriesServices.getCategories();
  }

  @Post()
  addCategories(@Body() categorie: Categorie) {
    return this.categoriesServices.addCategories(categorie);
  } 
}
