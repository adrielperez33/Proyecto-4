import { Controller, Get } from '@nestjs/common';
import { ProductService } from '../products/products.service';
import { Product } from '../entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts(): Product[] {
    return this.productService.getAllProducts();
  }
}
