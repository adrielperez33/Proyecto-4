import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../entities/Orders.entitiy';
import { OrderDetail } from '../entities/OrderDetail.entity';
import { Product } from '../entities/Products.entity';
import { User } from '../entities/Users.entitiy';
import { CreateOrderDto } from './order.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  async addOrder(createOrderDto: CreateOrderDto): Promise<Omit<Order, 'user'>> {
    const { userId, products } = createOrderDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar existencia del usuario
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Verificar productos
      const productEntities = await this.productRepository.findByIds(
        products.map((p) => p.id),
      );

      if (productEntities.length !== products.length) {
        throw new NotFoundException('Uno o más productos no encontrados');
      }

      // Validar stock y calcular total
      let total = 0;
      const orderDetails: OrderDetail[] = [];

      for (const product of productEntities) {
        if (product.stock <= 0) {
          throw new NotFoundException(
            `Producto ${product.name} sin stock disponible`,
          );
        }

        total += parseFloat(product.price.toString());

        // Crear OrderDetail y asignar producto
        const orderDetail = this.orderDetailRepository.create({
          price: parseFloat(product.price.toString()),
          products: [product],
        });

        orderDetails.push(orderDetail);
      }

      total = parseFloat(total.toFixed(2));

      // Crear y guardar la orden
      const order = this.orderRepository.create({
        user: user,
        total,
        date: new Date().toISOString(), // Asegúrate de que no sea null
        orderDetails,
      });

      console.log('Fecha de la orden:', order.date); // Verifica que la fecha esté bien asignada

      await queryRunner.manager.save(order);

      // Reducir stock de los productos
      for (const product of productEntities) {
        product.stock -= 1;
        await queryRunner.manager.save(product);
      }

      await queryRunner.commitTransaction();

      // Obtener la orden guardada
      const savedOrder = await this.orderRepository.findOne({
        where: { id: order.id },
        relations: ['user', 'orderDetails', 'orderDetails.products'],
      });

      // Omitir los campos sensibles del usuario
      const userWithoutSensitiveData = {
        id: savedOrder.user.id,
        name: savedOrder.user.name,
        email: savedOrder.user.email,
        phone: savedOrder.user.phone,
        country: savedOrder.user.country,
        address: savedOrder.user.address,
        city: savedOrder.user.city,
      };

      // Crear el objeto de la orden con los datos omitidos del usuario
      const orderedOrder = {
        id: savedOrder.id,
        total: savedOrder.total,
        date: savedOrder.date,
        user: userWithoutSensitiveData, // Usuario con los datos omitidos
        orderDetails: savedOrder.orderDetails, // Detalles de la orden
      };

      return orderedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrder(orderId: string): Promise<Omit<Order, 'user'>> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderDetails', 'orderDetails.products', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Crear un objeto con los datos del usuario, omitiendo 'password', 'admin' y 'orders'
    const userWithoutSensitiveData = {
      id: order.user.id,
      name: order.user.name,
      email: order.user.email,
      phone: order.user.phone,
      country: order.user.country,
      address: order.user.address,
      city: order.user.city,
    };

    // Crear el objeto de respuesta final sin la propiedad completa 'user'
    const orderedOrder = {
      id: order.id,
      total: order.total,
      date: order.date,
      user: userWithoutSensitiveData, // Usuario con los datos omitidos
      orderDetails: order.orderDetails, // Detalles de la orden
    };

    return orderedOrder;
  }
}
