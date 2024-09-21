import { Injectable } from '@nestjs/common';
import { Product } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categorie } from 'src/categories/categories.entity';
import { vs as uuid } from 'uuid';
// import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    // private readonly productsRepository: ProductsRepository
    @InjectRepository(Product)
    private dbRepository: Repository<Product>,
    @InjectRepository(Categorie)
    private categoriesRepository: Repository<Categorie>,
  ) {}

  private initialCategories = [
    { name: 'smartphone' },
    { name: 'monitor' },
    { name: 'keyboard' },
    { name: 'mouse' },
  ];

  private initialProducts = [
    {
      name: 'Iphone 15',
      description: 'The best smartphone in the world',
      price: 199.99,
      stock: 12,
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

  async preCarga(): Promise<Product[]> {
    // Obtén las categorías existentes
    const categories = await this.categoriesRepository.find();

    if (categories.length === 0) {
      throw new Error('Debe cargarse primero las categorías.');
    }

    // Crea un mapa de categorías por nombre
    const categoryMap = categories.reduce(
      (map, category) => {
        map[category.name] = category;
        return map;
      },
      {} as Record<string, Categorie>,
    );

    // Verifica los productos existentes
    const existingProducts = await this.dbRepository.find();
    const existingProductNames = existingProducts.map((p) => p.name);

    // Filtra productos nuevos
    const productsToSave = this.initialProducts
      .filter((product) => !existingProductNames.includes(product.name))
      .map((product) => ({
        ...product,
        id: uuid(),
        category: categoryMap[product.category],
      }));

    // Guarda los productos nuevos
    if (productsToSave.length > 0) {
      await this.dbRepository.save(productsToSave);
    }

    // Devuelve todos los productos con sus categorías
    return this.dbRepository.find({ relations: ['category'] });
  }

  // getProducts(pagination: { page: number; limit: number }) {
  //   return this.productsRepository.getProducts(pagination);
  // }

  // getProductsId(id: number) {
  //   return this.productsRepository.getProductsId(id);
  // }

  // createProducts(product: Omit<Product, 'id'>): Promise<number> {
  //   return this.productsRepository.createProducts(product);
  // }

  // putProduct(
  //   id: number,
  //   product: Partial<Product>,
  // ): Promise<number | undefined> {
  //   return this.productsRepository.putProduct(id, product);
  // }

  // deleteProducts(id: number): Promise<number> {
  //   return this.productsRepository.deleteProducts(id);
  // }
}
