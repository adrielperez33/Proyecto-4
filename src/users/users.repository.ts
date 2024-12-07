import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/Users.entitiy';

@Injectable()
export class UsersRepository {
  private Users: User[] = [
    {
      id: 1,
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: 'securepassword123',
      address: '123 Main St',
      phone: '555-1234',
      country: 'USA',
      city: 'New York',
    },
    {
      id: 2,
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: 'password321',
      address: '456 Elm St',
      phone: '555-5678',
    },
  ];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.Users.find((user) => user.email === email);
  }

  getUsers(page: number, limit: number): User[] {
    const offset = (page - 1) * limit;
    return this.Users.slice(offset, offset + limit);
  }

  getUsersId(id: number): Partial<User> | undefined {
    const user = this.Users.find((user) => user.id === id);

    if (user) {
      const { password, ...partialUser } = user;
      return partialUser;
    }
    return undefined;
  }

  postUser(user: Omit<User, 'id'>): number {
    const newUser = {
      id: this.Users.length + 1,
      ...user,
    };
    this.Users.push(newUser);
    return newUser.id;
  }

  putUser(
    id: number,
    user: Partial<Omit<User, 'id' | 'password'>>,
  ): number | undefined {
    const index = this.Users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.Users[index] = { ...this.Users[index], ...user };
      return id;
    }
    return undefined;
  }

  deleteUser(id: number): number | undefined {
    const index = this.Users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.Users.splice(index, 1);
      return id;
    }
    return undefined;
  }
}
