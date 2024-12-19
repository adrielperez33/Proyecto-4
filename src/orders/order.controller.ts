import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async addOrder(@Body() createOrderDto: CreateOrderDto) {
    console.log('Solicitud recibida:', createOrderDto);
    return this.orderService.addOrder(createOrderDto);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }
}
