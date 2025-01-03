import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';
import { UUIDValidationPipe } from '../pipes/uuid-validation.pipe'; // Asegúrate de que esta ruta sea correcta
import { AuthGuard } from 'src/auth/guards/AuthGuard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Crear una nueva orden' })
  @Post()
  @UseGuards(AuthGuard)
  async addOrder(@Body() createOrderDto: CreateOrderDto) {
    console.log('Solicitud recibida:', createOrderDto);
    return this.orderService.addOrder(createOrderDto);
  }

  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @Get(':id')
  @UseGuards(AuthGuard)
  @UsePipes(UUIDValidationPipe)
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }
}
