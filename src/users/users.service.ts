import { Injectable, OnModuleInit } from '@nestjs/common'; // OnModuleInit para ejecutar código en el arranque
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/Users.entitiy';
import { Order } from '../entities/Orders.entitiy';

@Injectable()
export class UsersService implements OnModuleInit {
  // Implementa OnModuleInit

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async onModuleInit() {
    await this.seedUsers(); // Ejecuta el Seeder en el arranque
  }

  // Método para obtener usuarios con paginación
  async getUsers(page: number, limit: number): Promise<User[]> {
    return this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  // Método para obtener un usuario por su ID
  async getUsersId(id: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders'], // Cargar las órdenes completas
    });

    if (!user) {
      return undefined;
    }

    return user;
  }

  // Método para crear un nuevo usuario
  async postUser(user: Omit<User, 'id'>): Promise<string> {
    const newUser = this.userRepository.create(user);
    const result = await this.userRepository.save(newUser);
    return result.id;
  }

  // Método para actualizar un usuario existente
  async putUser(
    id: string,
    user: Partial<Omit<User, 'id' | 'password'>>,
  ): Promise<string | null> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) return null;

    Object.assign(existingUser, user);
    await this.userRepository.save(existingUser);
    return existingUser.id;
  }

  // Método para eliminar un usuario
  async deleteUser(id: string): Promise<string | null> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) return null;

    await this.userRepository.remove(existingUser);
    return existingUser.id;
  }

  // Seeder para precargar usuarios
  async seedUsers() {
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 0) return; // Solo agrega los usuarios si no existen

    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword', // Asegúrate de usar un hash real en producción
        phone: 123456789,
        country: 'USA',
        address: '123 Main St',
        city: 'New York',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'hashedpassword', // Asegúrate de usar un hash real en producción
        phone: 987654321,
        country: 'Canada',
        address: '456 Elm St',
        city: 'Toronto',
      },
    ];

    await this.userRepository.save(users); // Guarda los usuarios en la base de datos
  }
}
