import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/Users.entitiy';
import { Order } from '../entities/Orders.entitiy';

@Injectable()
export class UsersRepository {
  private Users: User[] = [
    {
      id: uuidv4(),
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword123',
      phone: 5551234,
      country: 'USA',
      address: '123 Main St',
      city: 'New York',
      orders: [
        { id: '101', date: '2024-01-01' },
        { id: '102', date: '2024-02-01' },
      ] as Order[],
    },
    {
      id: uuidv4(),
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'password321',
      phone: 5555678,
      country: 'USA',
      address: '456 Elm St',
      city: 'Los Angeles',
      orders: [{ id: '103', date: '2024-03-01' }] as Order[],
    },
  ];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.Users.find((user) => user.email === email);
  }

  getUsers(page: number, limit: number): User[] {
    const offset = (page - 1) * limit;
    return this.Users.slice(offset, offset + limit);
  }

  getUsersId(id: string): Partial<User> | undefined {
    const user = this.Users.find((user) => user.id === id);
    if (user) {
      const { password, ...partialUser } = user;
      return partialUser;
    }
    return undefined;
  }

  postUser(user: Omit<User, 'id'>): string {
    const newUser: User = {
      id: uuidv4(),
      ...user,
    };
    this.Users.push(newUser);
    return newUser.id;
  }

  putUser(
    id: string,
    user: Partial<Omit<User, 'id' | 'password'>>,
  ): string | undefined {
    const index = this.Users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.Users[index] = { ...this.Users[index], ...user };
      return id;
    }
    return undefined;
  }

  deleteUser(id: string): string | undefined {
    const index = this.Users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.Users.splice(index, 1);
      return id;
    }
    return undefined;
  }
}
