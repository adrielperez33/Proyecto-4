import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
// import { ProductsRepository } from './products.repository';
import { CategoriesService } from 'src/categories/categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { Categorie } from 'src/categories/categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Categorie])],
  providers: [ProductsService, CategoriesService],
  controllers: [ProductsController],
})
export class ProductsModule {}
