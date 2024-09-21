import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './orders.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id')
  getOrder(@Param('id') id: string): Promise<Order> {
    return this.ordersService.getOrder(id);
  }

  @Post()
  async addOrder(
    @Body() orderData: { userId: string; products: { id: string }[] },
  ): Promise<Order> {
    return this.ordersService.addOrder(orderData);
  }
}
