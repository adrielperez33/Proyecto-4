import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersRepository {
  private users: User[] = [
    {
      id: uuid(),
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: 'password123',
      address: '123 Main St',
      phone: 1234567890,
      country: 'USA',
      city: 'New York',
      orders: []
    },
    {
      id: uuid(),
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: 'password456',
      address: '456 Elm St',
      phone: 9876543210,
      country: 'Canada',
      city: 'Toronto',
      orders: []
    },
  ];

  omitPassword(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUsers({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<Omit<User, 'password'>[]> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return this.users
      .slice(startIndex, endIndex)
      .map((user) => this.omitPassword(user));
  }

  async getUsersId(id: string): Promise<Omit<User, 'password'>> {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.omitPassword(user);
  }

  async createUsers(user: Omit<User, 'id'>): Promise<string> {
    const id = uuid();
    this.users = [...this.users, { id, ...user }];
    return id;
  }

  async putUsers(
    id: string,
    product: Partial<User>,
  ): Promise<string | undefined> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return undefined;
    }
    const newUser = { ...this.users[userIndex], ...product };
    this.users[userIndex] = newUser;
    return id;
  }

  async deleteUsers(id: string): Promise<string> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    this.users.splice(userIndex, 1);
    return id;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
