import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  getUsers(pagination: {
    page: number;
    limit: number;
  }): Promise<Omit<User, 'password'>[]> {
    return this.usersRepository.getUsers(pagination);
  }

  getUserId(id: number): Promise<Omit<User, 'password'>> {
    return this.usersRepository.getUsersId(id);
  }

  createUser(user: Omit<User, 'id'>): Promise<number> {
    return this.usersRepository.createUsers(user);
  }

  putUser(id: number, user: Partial<User>): Promise<number> {
    return this.usersRepository.putUsers(id, user);
  }

  deleteUser(id: number): Promise<number> {
    return this.usersRepository.deleteUsers(id);
  }
}
