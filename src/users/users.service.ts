import { Injectable, NotFoundException } from '@nestjs/common';
// import { UsersRepository } from './users.repository';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<Omit<User, 'password'>[]> {
    const [result, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return result.map((user) => this.omitPassword(user));
  }

  async getUserId(id: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const orders = user.orders.map((order) => ({
      id: order.id,
      date: order.date,
    }));

    const userWithOrders = {
      ...this.omitPassword(user),
      orders,
    };

    return userWithOrders;
  }

  async createUser(user: Omit<User, 'id'>): Promise<string> {
    const newUser = this.userRepository.create({
      id: uuid(),
      ...user,
    });
    await this.userRepository.save(newUser);
    return newUser.id;
  }

  async putUser(id: string, user: Partial<User>): Promise<string | undefined> {
    await this.userRepository.update(id, user);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    return updatedUser ? updatedUser.id : undefined;
  }

  async deleteUser(id: string): Promise<string> {
    await this.userRepository.delete(id);
    return id;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  omitPassword(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

//   getUsers(pagination: {
//     page: number;
//     limit: number;
//   }): Promise<Omit<User, 'password'>[]> {
//     return this.usersRepository.getUsers(pagination);
//   }

//   getUserId(id: string): Promise<Omit<User, 'password'>> {
//     return this.usersRepository.getUsersId(id);
//   }

//   createUser(user: Omit<User, 'id'>): Promise<string> {
//     return this.usersRepository.createUsers(user);
//   }

//   putUser(id: string, user: Partial<User>): Promise<string | undefined> {
//     return this.usersRepository.putUsers(id, user);
//   }

//   deleteUser(id: string): Promise<string> {
//     return this.usersRepository.deleteUsers(id);
//   }
// }
