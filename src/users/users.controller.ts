import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/Users.entitiy';
import { AuthGuard } from '../auth/AuthGuard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get()
  getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ): Promise<User[]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.userService.getUsers(pageNumber, limitNumber);
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserId(@Param('id') id: string): Promise<Partial<User> | undefined> {
    const user = await this.userService.getUsersId(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Mapeamos las órdenes pero conservamos la estructura completa de 'orderDetail'
    const orders = user.orders.map((order) => ({
      ...order, // Devolvemos la orden completa
      orderDetails: order.orderDetails ? order.orderDetails : null, // Mantenemos el objeto completo de 'orderDetails'
    }));

    // Devolvemos el usuario con las órdenes completas
    return { ...user, orders };
  }

  @HttpCode(201)
  @Post()
  async postUser(@Body() user: Omit<User, 'id'>): Promise<{ id: string }> {
    const newUserId = await this.userService.postUser(user);
    return { id: newUserId };
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Put(':id')
  async putUser(
    @Param('id') id: string,
    @Body() user: Partial<Omit<User, 'id' | 'password'>>,
  ): Promise<{ id: string }> {
    const updatedId = await this.userService.putUser(id, user);
    if (!updatedId) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { id: updatedId };
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ id: string }> {
    const deletedId = await this.userService.deleteUser(id);
    if (!deletedId) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { id: deletedId };
  }
}
