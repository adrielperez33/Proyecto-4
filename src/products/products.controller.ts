import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from 'src/entities/Products.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsServices: ProductsService) {}

  @Get()
  getProducts(): Products[] {
    return this.productsServices.getProducts();
  }
}
