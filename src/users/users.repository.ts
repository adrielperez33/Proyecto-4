import { Injectable } from '@nestjs/common';
import { User } from './users.entity';

@Injectable()
export class UsersRepository {
  private users: User[] = [
    {
      id: 1,
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: 'password123',
      address: '123 Main St',
      phone: '123-456-7890',
      country: 'USA',
      city: 'New York',
    },
    {
      id: 2,
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: 'password456',
      address: '456 Elm St',
      phone: '987-654-3210',
      country: 'Canada',
      city: 'Toronto',
    },
  ];
  omitPassword(user: User): Omit<User, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  async getUsersId(id: number): Promise<Omit<User, 'password'>> {
    const user = this.users.find((user) => user.id === id);
    return this.omitPassword(user);
  }

  async createUsers(user: Omit<User, 'id'>): Promise<number> {
    const id = this.users.length + 1;
    this.users = [...this.users, { id, ...user }];
    return id;
  }

  async putUsers(
    id: number,
    product: Partial<User>,
  ): Promise<number | undefined> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return undefined;
    }
    const newUser = { ...this.users[userIndex], ...product };
    this.users[userIndex] = newUser;
    return id;
  }

  async deleteUsers(id: number): Promise<number> {
    const productIndex = this.users.findIndex((user) => user.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }
    this.users.splice(productIndex, 1);
    return id;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
