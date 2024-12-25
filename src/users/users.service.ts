import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
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
  async deleteUser(id: string): Promise<string> {
    // Verificar si el usuario existe en la base de datos
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Eliminar las órdenes asociadas al usuario
    await this.orderRepository.delete({ user: { id } });

    // Eliminar al usuario
    const idEliminado = existingUser.name;
    await this.userRepository.remove(existingUser);

    // Retornar el ID del usuario eliminado y un mensaje de confirmación
    return `Usuario ${idEliminado} eliminado correctamente`;
  }

  // Método para encontrar un usuario por su email
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'], // Seleccionamos solo los campos necesarios
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
      name,
      email,
      password,
      confirmPassword,
      address,
      phone,
      country,
      city,
    } = createUserDto;

    // Verificar si el correo electrónico ya está registrado
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está en uso');
    }

    // Validar que la contraseña y la confirmación de la contraseña coincidan
    if (password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario solo si el correo no está en uso
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword, // Aquí guardamos la contraseña hasheada
      address,
      phone,
      country,
      city,
    });

    try {
      // Guardar el usuario en la base de datos
      await this.userRepository.save(user);

      return user; // Retornar el usuario completo, con la contraseña hasheada
    } catch (error) {
      throw new BadRequestException(
        'Error al registrar el usuario: ' + error.message,
      );
    }
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
