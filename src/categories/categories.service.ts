import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categorie } from './categories.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Product } from 'src/products/products.entity';

@Injectable()
export class CategoriesService {
  private initialCategories: Partial<Categorie>[] = [
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
      category: { name: 'smartphone' },
    },
    {
      name: 'Samsung Galaxy S23',
      description: 'The best smartphone in the world',
      price: 150.0,
      stock: 12,
      category: { name: 'smartphone' },
    },
    {
      name: 'Motorola Edge 40',
      description: 'The best smartphone in the world',
      price: 179.89,
      stock: 12,
      category: { name: 'smartphone' },
    },
    {
      name: 'Samsung Odyssey G9',
      description: 'The best monitor in the world',
      price: 299.99,
      stock: 12,
      category: { name: 'monitor' },
    },
    {
      name: 'LG UltraGear',
      description: 'The best monitor in the world',
      price: 199.99,
      stock: 12,
      category: { name: 'monitor' },
    },
    {
      name: 'Acer Predator',
      description: 'The best monitor in the world',
      price: 150.0,
      stock: 12,
      category: { name: 'monitor' },
    },
    {
      name: 'Razer BlackWidow V3',
      description: 'The best keyboard in the world',
      price: 99.99,
      stock: 12,
      category: { name: 'keyboard' },
    },
    {
      name: 'Corsair K70',
      description: 'The best keyboard in the world',
      price: 79.99,
      stock: 12,
      category: { name: 'keyboard' },
    },
    {
      name: 'Logitech G Pro',
      description: 'The best keyboard in the world',
      price: 59.99,
      stock: 12,
      category: { name: 'keyboard' },
    },
    {
      name: 'Razer Viper',
      description: 'The best mouse in the world',
      price: 49.99,
      stock: 12,
      category: { name: 'mouse' },
    },
    {
      name: 'Logitech G502 Pro',
      description: 'The best mouse in the world',
      price: 39.99,
      stock: 12,
      category: { name: 'mouse' },
    },
    {
      name: 'SteelSeries Rival 3',
      description: 'The best mouse in the world',
      price: 29.99,
      stock: 12,
      category: { name: 'mouse' },
    },
  ];

  constructor(
    @InjectRepository(Categorie)
    private categoriesRepository: Repository<Categorie>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getCategories(): Promise<Categorie[]> {
    let categories = await this.categoriesRepository.find({
      relations: ['products'],
    });

    if (categories.length === 0) {
      // Crear categorías iniciales si no existen
      const savedCategories = await this.categoriesRepository.save(
        this.initialCategories.map((category) => ({
          ...category,
          id: uuid(), // Generar UUID para cada categoría
        })),
      );

      // Mapa de categorías por nombre
      const categoryMap = savedCategories.reduce(
        (map, category) => {
          map[category.name] = category;
          return map;
        },
        {} as Record<string, Categorie>,
      );

      // Crear productos y asociarlos con las categorías
      const productsToSave = this.initialProducts.map((product) => ({
        ...product,
        id: uuid(), // Generar UUID para cada producto
        category: categoryMap[product.category.name], // Asociar la categoría por nombre
      }));

      // Guardar productos
      await this.productsRepository.save(productsToSave);

      // Obtener categorías con productos
      categories = await this.categoriesRepository.find({
        relations: ['products'],
      });
    }

    return categories;
  }

  addCategories(categorie: Categorie) {
    return this.categoriesRepository.save(categorie);
  }
}
