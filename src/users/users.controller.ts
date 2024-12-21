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
import { CreateUserDto } from './CreateUserDto';
import { UUIDValidationPipe } from '../pipes/uuid-validation.pipe'; // Importamos el Pipe

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
  async getUserId(
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<Partial<User> | undefined> {
    // Aquí se aplica el Pipe
    const user = await this.userService.getUsersId(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Mapeamos las órdenes pero conservamos la estructura completa de 'orderDetails'
    const orders = user.orders.map((order) => ({
      ...order, // Devolvemos la orden completa
      orderDetails: order.orderDetails ? order.orderDetails : null, // Ahora 'orderDetails' es la propiedad correcta
    }));

    // Devolvemos el usuario con las órdenes completas
    return { ...user, orders };
  }

  @HttpCode(201)
  @Post()
  async postUser(@Body() user: CreateUserDto): Promise<{ id: string }> {
    const newUserId = await this.userService.postUser(user);
    return { id: newUserId };
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Put(':id')
  async putUser(
    @Param('id', UUIDValidationPipe) id: string, // Aplicamos el Pipe también en PUT
    @Body() user: Partial<CreateUserDto>, // Usamos Partial<CreateUserDto> para permitir actualizar solo algunos campos
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
  async deleteUser(
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<{ id: string }> {
    // Aplicamos el Pipe en DELETE
    const deletedId = await this.userService.deleteUser(id);
    if (!deletedId) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { id: deletedId };
  }
}
