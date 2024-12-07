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
import { User } from 'src/entities/Users.entitiy';
import { AuthGuard } from 'src/auth/AuthGuard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get()
  getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ): User[] {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.userService.getUsers(pageNumber, limitNumber);
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get(':id')
  getUserId(@Param('id') id: string): Partial<User> | undefined {
    return this.userService.getUsersId(Number(id));
  }

  @HttpCode(201)
  @Post()
  postUser(@Body() user: Omit<User, 'id'>): number {
    return this.userService.postUser(user);
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Put(':id')
  putUser(
    @Param('id') id: string,
    @Body() user: Partial<Omit<User, 'id' | 'password'>>,
  ): { id: number } {
    const updatedId = this.userService.putUser(Number(id), user);
    if (!updatedId) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      id: updatedId,
    };
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(Number(id));
  }
}
