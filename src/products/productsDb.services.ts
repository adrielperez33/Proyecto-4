import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/Products.entity';
import { Category } from '../entities/Categories.entity';
import { CreateProductDto } from './CreateProductDto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // Seeder method
  async addProducts(products: any[]): Promise<void> {
    for (const product of products) {
      const existingProduct = await this.productRepository.findOne({
        where: { name: product.name },
      });
      if (!existingProduct) {
        const category = await this.categoryRepository.findOne({
          where: { name: String(product.category) }, // Asegurando que 'category' es un string
        });
        if (category) {
          const newProduct = this.productRepository.create({
            ...product,
            category: category,
          });
          await this.productRepository.save(newProduct);
        }
      }
    }
  }

  // Get products with pagination
  async getProducts(page: number, limit: number): Promise<Product[]> {
    return this.productRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category'],
    });
  }

  // Get product by ID
  async getProductById(id: string): Promise<Product | undefined> {
    return this.productRepository.findOne({
      where: { id }, // Asegurando que 'id' es de tipo string
      relations: ['category'],
    });
  }

  // Add new product
  async addProduct(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { name: createProductDto.category },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const newProduct = this.productRepository.create({
      ...createProductDto,
      category,
    });

    return this.productRepository.save(newProduct);
  }

  // Update product details
  async updateProduct(
    id: string,
    productDto: Partial<CreateProductDto>,
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Si el DTO incluye una categoría, hay que buscarla en la base de datos
    let category;
    if (productDto.category) {
      category = await this.categoryRepository.findOne({
        where: { name: productDto.category },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    // Asignamos los valores actualizados, incluyendo la categoría convertida
    Object.assign(existingProduct, {
      ...productDto,
      category: category ?? existingProduct.category, // Si no se envía categoría, mantiene la actual
    });

    return this.productRepository.save(existingProduct);
  }

  // Delete product
  async deleteProduct(
    id: string,
  ): Promise<{ message: string; product: { id: string; name: string } }> {
    // Buscar el producto con sus detalles de orden
    const existingProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['orderDetails'], // Relacionamos los detalles de la orden
    });

    // Si no se encuentra el producto, lanzar error
    if (!existingProduct) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Si el producto tiene detalles de órdenes asociadas, no se puede eliminar
    if (
      existingProduct.orderDetails &&
      existingProduct.orderDetails.length > 0
    ) {
      throw new ConflictException(
        'No se puede eliminar el producto porque tiene órdenes asociadas',
      );
    }

    // Eliminar el producto si no tiene órdenes asociadas
    await this.productRepository.delete(id);

    // Devolver un mensaje de éxito con el id y nombre del producto eliminado
    return {
      message: `El producto "${existingProduct.name}" ha sido eliminado correctamente.`,
      product: {
        id: existingProduct.id,
        name: existingProduct.name,
      },
    };
  }

  async updateProductImage(id: string, imageUrl: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new Error('Producto no encontrado');
    }
    product.imgUrl = imageUrl;
    return this.productRepository.save(product);
  }
}
