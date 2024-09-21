import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { AuthGuard } from 'src/auth/auth.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(200)
  @Get()
  @UseGuards(AuthGuard)
  getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 5) {
    return this.usersService.getUsers({ page, limit });
  }

  @HttpCode(200)
  @Get(':id')
  @UseGuards(AuthGuard)
  getUserId(
    @Param('id') id: string,
  ): Promise<
    Omit<User, 'password'> & { orders: { id: string; date: string }[] }
  > {
    return this.usersService.getUserId(id);
  }

  @HttpCode(201)
  @Post()
  createUser(@Body() user: Omit<User, 'id'>): Promise<string> {
    return this.usersService.createUser(user);
  }

  @HttpCode(200)
  @Put(':id')
  @UseGuards(AuthGuard)
  putUser(
    @Body() user: Partial<User>,
    @Param('id') id: string,
  ): Promise<string | undefined> {
    return this.usersService.putUser(id, user);
  }

  @HttpCode(200)
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id') id: string): Promise<string> {
    return this.usersService.deleteUser(id);
  }
}
