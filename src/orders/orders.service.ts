import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, In } from 'typeorm'; // Asegúrate de importar MoreThan
import { Order } from './orders.entity';
import { OrderDetail } from 'src/ordersDetails/ordersDetails.entity';
import { User } from 'src/users/users.entity';
import { Product } from 'src/products/products.entity';
import { v4 as uuid } from 'uuid'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailsRepository: Repository<OrderDetail>,
  ) {}

  async getOrder(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['orderDetails', 'orderDetails.products', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async addOrder(orderData: {
    userId: string;
    products: { id: string }[];
  }): Promise<Order> {
    // Buscar al usuario por id
    const user = await this.usersRepository.findOne({
      where: { id: orderData.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${orderData.userId} not found`);
    }

    // Obtener los IDs de los productos
    const productIds = orderData.products.map((product) => product.id);

    // Buscar los productos por id y filtrar por stock mayor a 0
    const products = await this.productsRepository.find({
      where: {
        id: In(productIds),
        stock: MoreThan(0),
      },
    });

    // Validar si faltan productos o están fuera de stock
    if (products.length !== orderData.products.length) {
      throw new NotFoundException(
        'One or more products are out of stock or do not exist',
      );
    }

    // Crear la orden
    const order = new Order();
    order.id = uuid();
    order.user = user;
    order.date = new Date().toISOString();

    // Calcular el precio total y construir el detalle de la orden
    const orderDetail = new OrderDetail();
    orderDetail.id = uuid();
    orderDetail.price = products.reduce(
      (sum, product) => sum + Number(product.price),
      0,
    );
    orderDetail.products = products;

    // Guardar los detalles de la orden y asociar a la orden
    await this.orderDetailsRepository.save(orderDetail);

    order.orderDetails = orderDetail;
    await this.ordersRepository.save(order);

    // Reducir stock de productos
    for (const product of products) {
      product.stock -= 1;
      await this.productsRepository.save(product);
    }

    return order;
  }
}
