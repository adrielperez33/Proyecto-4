import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from 'src/entities/Users.entitiy';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  getUsers(): User[] {
    return this.userRepository.getUsers();
  }
}
