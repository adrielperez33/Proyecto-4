import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './productsDb.services';
import { AuthGuard } from '../auth/guards/AuthGuard';
import { Product } from '../entities/Products.entity'; // Asegúrate de tener la entidad Product definida
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/Decoradores/roles.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Seeder para precargar productos
  @Get('seeder')
  async preloadProducts(): Promise<void> {
    const products = [
      {
        name: 'Iphone 15',
        description: 'The best smartphone in the world',
        price: 199.99,
        stock: 12,
        imgUrl: 'https://example.com/images/iphone15.jpg',
        category: 'smartphone',
      },
      {
        name: 'Samsung Galaxy S23',
        description: 'The best smartphone in the world',
        price: 150.0,
        stock: 12,
        category: 'smartphone',
      },
      {
        name: 'Motorola Edge 40',
        description: 'The best smartphone in the world',
        price: 179.89,
        stock: 12,
        category: 'smartphone',
      },
      {
        name: 'Samsung Odyssey G9',
        description: 'The best monitor in the world',
        price: 299.99,
        stock: 12,
        category: 'monitor',
      },
      {
        name: 'LG UltraGear',
        description: 'The best monitor in the world',
        price: 199.99,
        stock: 12,
        category: 'monitor',
      },
      {
        name: 'Acer Predator',
        description: 'The best monitor in the world',
        price: 150.0,
        stock: 12,
        category: 'monitor',
      },
      {
        name: 'Razer BlackWidow V3',
        description: 'The best keyboard in the world',
        price: 99.99,
        stock: 12,
        category: 'keyboard',
      },
      {
        name: 'Corsair K70',
        description: 'The best keyboard in the world',
        price: 79.99,
        stock: 12,
        category: 'keyboard',
      },
      {
        name: 'Logitech G Pro',
        description: 'The best keyboard in the world',
        price: 59.99,
        stock: 12,
        category: 'keyboard',
      },
      {
        name: 'Razer Viper',
        description: 'The best mouse in the world',
        price: 49.99,
        stock: 12,
        category: 'mouse',
      },
      {
        name: 'Logitech G502 Pro',
        description: 'The best mouse in the world',
        price: 39.99,
        stock: 12,
        category: 'mouse',
      },
      {
        name: 'SteelSeries Rival 3',
        description: 'The best mouse in the world',
        price: 29.99,
        stock: 12,
        category: 'mouse',
      },
    ];
    await this.productService.addProducts(products);
  }

  // Obtener productos con paginación
  @HttpCode(200)
  @Get()
  async getProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ): Promise<Product[]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.productService.getProducts(pageNumber, limitNumber);
  }

  // Obtener un producto por su ID
  @HttpCode(200)
  @Get(':id')
  getProductById(@Param('id') id: string): Promise<Product | undefined> {
    return this.productService.getProductById(id); // Se pasa el id como string
  }

  // Agregar nuevo producto
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @Post()
  postProduct(@Body() product: Omit<Product, 'id'>): Promise<Product> {
    return this.productService.addProduct(product);
  }

  // Actualizar un producto
  @HttpCode(200)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @Roles('admin')
  async updateProduct(
    @Param('id') id: string, // 'id' será un string
    @Body() product: Partial<Product>, // El cuerpo es un objeto que contiene las propiedades del producto que se quieren actualizar
  ): Promise<Product> {
    return this.productService.updateProduct(id, product); // Pasamos el id y el producto al servicio
  }

  // Eliminar un producto
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(id); // Se pasa el id como string
  }
}
