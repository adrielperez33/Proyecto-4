import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/Orders.entitiy';
import { OrderDetail } from '../entities/OrderDetail.entity';
import { Product } from '../entities/Products.entity';
import { User } from '../entities/Users.entitiy';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail, Product, User])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
