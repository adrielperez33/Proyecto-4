// import { Injectable } from '@nestjs/common';
// import { Products } from 'src/entities/Products.entity';

// @Injectable()
// export class ProductsRepository {
//   private products: Products[] = [
//     {
//       id: 1,
//       name: 'Product 1',
//       description: 'Description for product 1',
//       price: 29.99,
//       stock: true,
//       imgUrl: 'https://example.com/product1.jpg',
//     },
//     {
//       id: 2,
//       name: 'Product 2',
//       description: 'Description for product 2',
//       price: 49.99,
//       stock: false,
//       imgUrl: 'https://example.com/product2.jpg',
//     },
//   ];

//   async getProducts(page: number, limit: number): Promise<Products[]> {
//     const offset = (page - 1) * limit;
//     return this.products.slice(offset, offset + limit);
//   }

//   getProductsId(id: number): Products | undefined {
//     return this.products.find((product) => product.id === id);
//   }

//   postProducts(product: Omit<Products, 'id'>): number {
//     const newProduct = {
//       id: this.products.length + 1,
//       ...product,
//     };
//     this.products.push(newProduct);
//     return newProduct.id;
//   }

//   putProducts(
//     id: number,
//     products: Partial<Omit<Products, 'id' | 'password'>>,
//   ): number | undefined {
//     const index = this.products.findIndex((product) => product.id === id);
//     if (index !== -1) {
//       this.products[index] = { ...this.products[index], ...products };
//       return id;
//     }
//     return undefined;
//   }

//   deleteProducts(id: number) {
//     const index = this.products.findIndex((product) => product.id === id);
//     if (index !== -1) {
//       this.products.splice(index, 1);
//       return id;
//     }
//     return undefined;
//   }
// }
