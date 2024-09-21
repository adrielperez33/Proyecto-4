import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { OrderDetail } from 'src/ordersDetails/ordersDetails.entity';
import { Product } from 'src/products/products.entity';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail, Product, User])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
