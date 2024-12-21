import { Injectable, OnModuleInit } from '@nestjs/common'; // OnModuleInit para ejecutar código en el arranque
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/Users.entitiy';
import { Order } from '../entities/Orders.entitiy';
import { CreateUserDto } from './CreateUserDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
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
      relations: [
        'orders',
        'orders.orderDetails',
        'orders.orderDetails.products',
      ], // Asegúrate de cargar 'orderDetails' y 'products'
    });

    if (!user) {
      return undefined;
    }

    return user;
  }

  // Método para crear un nuevo usuario
  async postUser(user: CreateUserDto): Promise<string> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
    const result = await this.userRepository.save(newUser);
    return result.id;
  }

  // Método para actualizar un usuario existente
  async putUser(
    id: string,
    user: Partial<CreateUserDto>, // Asegúrate de que es un Partial del DTO
  ): Promise<string | null> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) return null;

    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

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

  // Método para encontrar un usuario por su email
  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } }); // Busca al usuario por email
  }

  // Seeder para precargar usuarios
  async seedUsers() {
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 0) return; // Solo agrega los usuarios si no existen

    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('hashedpassword', 10), // Asegúrate de usar un hash real en producción
        phone: 123456789,
        country: 'USA',
        address: '123 Main St',
        city: 'New York',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('hashedpassword', 10), // Asegúrate de usar un hash real en producción
        phone: 987654321,
        country: 'Canada',
        address: '456 Elm St',
        city: 'Toronto',
      },
    ];

    await this.userRepository.save(users); // Guarda los usuarios en la base de datos
  }
}
