import {
  // Body,
  Controller,
  // Delete,
  Get,
  // HttpCode,
  // Param,
  // Post,
  // Put,
  // Query,
  // UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
// import { Product } from './products.entitiy';
// import { AuthGuard } from 'src/auth/auth.guards';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsServices: ProductsService) {}

  // @HttpCode(200)
  // @Get()
  // getProducts(
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 5,
  // ) {
  //   return this.productsServices.getProducts({ page, limit });
  // }

  @Get('seeder')
  preCarga(){
    return this.productsServices.preCarga()
  }

  // @HttpCode(200)
  // @Get(':id')
  // getProductsId(@Param('id') id: string) {
  //   return this.productsServices.getProductsId(Number(id));
  // }

  // @HttpCode(201)
  // @Post()
  // @UseGuards(AuthGuard)
  // createProducts(@Body() product: Product) {
  //   return this.productsServices.createProducts(product);
  // }

  // @HttpCode(200)
  // @Put(':id')
  // @UseGuards(AuthGuard)
  // async putProduct(@Body() product: Partial<Product>, @Param('id') id: string) {
  //   return this.productsServices.putProduct(Number(id), product);
  // }

  // @HttpCode(200)
  // @Delete(':id')
  // @UseGuards(AuthGuard)
  // deleteProducts(@Param('id') id: string) {
  //   return this.productsServices.deleteProducts(Number(id));
  // }
}
