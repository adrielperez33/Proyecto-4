import { Controller, Get } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { User } from '../entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): User[] {
    return this.userService.getAllUsers();
  }
}
