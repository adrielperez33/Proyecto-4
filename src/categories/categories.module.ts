import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categorie } from './categories.entity';
import { Product } from 'src/products/products.entity';
import { ProductsService } from 'src/products/products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Categorie, Product])],
  providers: [CategoriesService, ProductsService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
