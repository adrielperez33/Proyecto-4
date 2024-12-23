import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/Products.entity';
import { ProductService } from './productsDb. services'; // Asegúrate de que esta ruta sea correcta
import { ProductController } from './productsDb.controller'; // Asegúrate de que esta ruta sea correcta
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService], // Exporta ProductService si lo necesitas en otros módulos
})
export class ProductsModule {}
