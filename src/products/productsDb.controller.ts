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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './productsDb.services';
import { AuthGuard } from '../auth/guards/AuthGuard';
import { Product } from '../entities/Products.entity'; // Asegúrate de tener la entidad Product definida
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/Decoradores/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UUIDValidationPipe } from 'src/pipes/uuid-validation.pipe';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/Categories.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './CreateProductDto';

@ApiTags('productos')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Seeder para precargar productos
  @Get('seeder')
  async preloadProducts(): Promise<void> {
    const categoriesCount = await this.categoryRepository.count();
    if (categoriesCount === 0) {
      throw new HttpException(
        'Debe precargar las categorías antes de ejecutar el seeder de productos.',
        HttpStatus.BAD_REQUEST, // 400 en vez de 500
      );
    }
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

  @ApiOperation({ summary: 'Obtener productos paginados' })
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

  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @HttpCode(200)
  @Get(':id')
  getProductById(
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<Product | undefined> {
    return this.productService.getProductById(id); // Se pasa el id como string
  }

  @ApiOperation({ summary: 'Agregar un nuevo producto' })
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @Post()
  postProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.addProduct(createProductDto);
  }

  @ApiOperation({ summary: 'Actualizar un producto' })
  @HttpCode(200)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @Roles('admin')
  async updateProduct(
    @Param('id', UUIDValidationPipe) id: string, // 'id' será un string
    @Body() product: Partial<Product>, // El cuerpo es un objeto que contiene las propiedades del producto que se quieren actualizar
  ): Promise<Product> {
    return this.productService.updateProduct(id, product); // Pasamos el id y el producto al servicio
  }

  @ApiOperation({ summary: 'Eliminar un producto' })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteProduct(@Param('id', UUIDValidationPipe) id: string): Promise<void> {
    return this.productService.deleteProduct(id); // Se pasa el id como string
  }
}
