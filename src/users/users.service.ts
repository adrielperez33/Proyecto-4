import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from 'src/entities/Users.entitiy';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  
  getUsers(page: number, limit: number): User[] {
    return this.userRepository.getUsers(page, limit);
  }
  
  getUsersId(id: number): Partial<User> | undefined {
    return this.userRepository.getUsersId(id);
  }
  
  postUser(user: Omit<User, 'id'>): number {
    return this.userRepository.postUser(user);
  }
  
  putUser(
    id: number,
    user: Partial<Omit<User, 'id' | 'password'>>,
  ): number | undefined {
    return this.userRepository.putUser(id, user);
  }
  
  deleteUser(id: number) {
    return this.userRepository.deleteUser(id);
  }

}
