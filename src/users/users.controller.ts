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
  constructor(private readonly usersServis: UsersService) {}

  @HttpCode(200)
  @Get()
  @UseGuards(AuthGuard)
  getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 5) {
    return this.usersServis.getUsers({ page, limit });
  }

  @HttpCode(200)
  @Get(':id')
  @UseGuards(AuthGuard)
  getUserId(@Param('id') id: string) {
    return this.usersServis.getUserId(Number(id));
  }

  @HttpCode(201)
  @Post()
  createUser(@Body() user: User): Promise<number> {
    return this.usersServis.createUser(user);
  }

  @HttpCode(200)
  @Put(':id')
  @UseGuards(AuthGuard)
  putUser(
    @Body() user: Partial<User>,
    @Param('id') id: string,
  ): Promise<number> {
    return this.usersServis.putUser(Number(id), user);
  }

  @HttpCode(200)
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id') id: string): Promise<number> {
    return this.usersServis.deleteUser(Number(id));
  }
}
