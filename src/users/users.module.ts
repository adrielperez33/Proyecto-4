import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/Users.entitiy';
import { Order } from '../entities/Orders.entitiy';
import { OrderDetail } from '../entities/OrderDetail.entity';
import { Product } from '../entities/Products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, OrderDetail, Product])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Asegúrate de exportar UsersService
})
export class UsersModule {}
