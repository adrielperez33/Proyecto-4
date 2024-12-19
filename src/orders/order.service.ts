import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './order.dto';
import { Order } from '../entities/Orders.entitiy';
import { User } from '../entities/Users.entitiy';
import { Product } from '../entities/Products.entity';
import { OrderDetail } from '../entities/OrderDetail.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async addOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    console.log('Service: addOrder called with:', createOrderDto);
    const { userId, products } = createOrderDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const productEntities = await this.productRepository.findByIds(
      products.map((p) => p.id),
    );
    if (productEntities.length !== products.length) {
      throw new NotFoundException('Uno o más productos no encontrados');
    }

    let total = 0;
    const orderDetails = [];
    for (const product of productEntities) {
      if (product.stock <= 0) {
        throw new NotFoundException(`Producto ${product.name} no tiene stock`);
      }

      const price =
        typeof product.price === 'string'
          ? parseFloat(product.price)
          : product.price;
      if (isNaN(price)) {
        throw new Error(`El precio del producto ${product.name} no es válido`);
      }

      total += price;

      const orderDetail = this.orderDetailRepository.create({
        price: price,
        product: product,
      });
      orderDetails.push(orderDetail);
    }

    total = parseFloat(total.toFixed(2));

    // Crear la orden
    const order = this.orderRepository.create({
      user,
      date: new Date().toISOString(),
      orderDetails: orderDetails, // Asociar detalles de la orden
    });
    await this.orderRepository.save(order);

    for (const product of productEntities) {
      product.stock -= 1;
      await this.productRepository.save(product);
    }

    return order;
  }

  async getOrder(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderDetails', 'orderDetails.product'],
    });
    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }
    return order;
  }
}
