import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from 'src/entities/Products.entity';
import { User } from 'src/entities/Users.entitiy';
import { AuthGuard } from 'src/auth/AuthGuard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsServices: ProductsService) {}

  @HttpCode(200)
  @Get()
  async getProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ): Promise<Products[]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.productsServices.getProducts(pageNumber, limitNumber);
  }

  @HttpCode(200)
  @Get(':id')
  getProductsId(@Param('id') id: string): Products | undefined {
    return this.productsServices.getProductsId(Number(id));
  }

  @HttpCode(201)
  @UseGuards(AuthGuard)
  @Post()
  postProducts(@Body() product: Omit<Products, 'id'>): number {
    return this.productsServices.postProducts(product);
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Put(':id')
  putProducts(@Param('id') id: string, @Body() user: Omit<User, 'id'>): number {
    return this.productsServices.putProducts(Number(id), user);
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteProducts(@Param('id') id: string) {
    return this.productsServices.deleteProducts(Number(id));
  }
}
