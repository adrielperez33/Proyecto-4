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
import { AuthGuard } from '../auth/guards/AuthGuard';
import { CreateUserDto } from './CreateUserDto';
import { UUIDValidationPipe } from '../pipes/uuid-validation.pipe'; // Importamos el Pipe
import { Roles } from 'src/auth/Decoradores/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @HttpCode(200)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @Roles('admin')
  async getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ): Promise<User[]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.userService.getUsers(pageNumber, limitNumber);
  }

  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserId(@Param('id', UUIDValidationPipe) id: string): Promise<{
    id: string;
    name: string;
    email: string;
    phone: number;
    country: string;
    address: string;
    city: string;
    orders: { id: string; date: string }[];
  }> {
    const user = await this.userService.getUsersId(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Transformamos las órdenes para incluir solo id y date
    const orders = user.orders.map((order) => ({
      id: order.id,
      date: new Date(order.date).toISOString().split('T')[0],
    }));

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      address: user.address,
      city: user.city,
      orders,
    };
  }

  // @HttpCode(201)
  // @Post()
  // async postUser(@Body() user: CreateUserDto): Promise<{ id: string }> {
  //   const newUserId = await this.userService.postUser(user);
  //   return { id: newUserId };
  // }

  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiBody({ type: CreateUserDto, required: false })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Put(':id')
  async putUser(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() user: Partial<CreateUserDto>,
  ): Promise<{ id: string }> {
    const updatedId = await this.userService.putUser(id, user);
    if (!updatedId) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { id: updatedId };
  }

  @ApiOperation({ summary: 'Eliminar un usuario' })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<{ id: string }> {
    const deletedId = await this.userService.deleteUser(id);
    if (!deletedId) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { id: deletedId }; // Retornamos un objeto con el ID del usuario eliminado
  }
}
