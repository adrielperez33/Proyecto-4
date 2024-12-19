import { Module } from '@nestjs/common';
// import { ProductsController } from './products.controller';
// import { ProductsService } from './products.service';
// import { ProductsRepository } from './products.repository';
import { ProductService } from './productsDb. services';
import { ProductController } from './productsDb.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/Products.entity';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductsModule {}
