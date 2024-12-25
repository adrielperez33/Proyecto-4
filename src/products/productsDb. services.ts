import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/Products.entity';
import { Category } from '../entities/Categories.entity';

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
  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { name: String(product.category) }, // Asegurando que 'category' es un string
    });
    if (category) {
      const newProduct = this.productRepository.create({
        ...product,
        category: category,
      });
      return this.productRepository.save(newProduct);
    }
    throw new NotFoundException('Category not found');
  }

  // Update product details
  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { id }, // 'id' debe ser un string
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
    Object.assign(existingProduct, product);
    return this.productRepository.save(existingProduct);
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    const existingProduct = await this.productRepository.findOne({
      where: { id }, // 'id' debe ser un string
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.delete(id);
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
