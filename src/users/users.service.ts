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
    const offset = (page - 1) * limit;
    const users = await this.userRepository.find({
      skip: offset,
      take: limit,
    });
    return users;
  }

  // Método para obtener un usuario por su ID
  async getUsersId(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders', 'orders.orderDetails'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Método para crear un nuevo usuario
  async postUser(user: CreateUserDto): Promise<string> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
      admin: false,
    });
    const result = await this.userRepository.save(newUser);
    return result.id;
  }

  // Método para actualizar un usuario existente
  async putUser(
    id: string,
    updatedUser: Partial<CreateUserDto>,
  ): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    Object.assign(user, updatedUser);
    await this.userRepository.save(user);
    return user.id;
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

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'admin'], // Asegúrate de incluir 'password'
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
      admin = false, // Establecer por defecto a false si no se pasa
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

    // Asegúrate de que admin esté correctamente configurado
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword, // Aquí guardamos la contraseña hasheada
      address,
      phone,
      country,
      city,
      admin, // Asignar el valor de admin que venga en el DTO o por defecto false
    });

    try {
      // Guardar el usuario en la base de datos
      await this.userRepository.save(user);
      return user; // Retornar el usuario completo
    } catch (error) {
      throw new BadRequestException(
        'Error al registrar el usuario: ' + error.message,
      );
    }
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'admin'], // Selecciona los campos necesarios
    });
  }

  // Seeder para precargar usuarios
  async seedUsers() {
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 0) return;

    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('hashedpassword', 10),
        phone: 123456789,
        country: 'USA',
        address: '123 Main St',
        city: 'New York',
        admin: false, // Asegurar que el campo admin sea falso por defecto
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('hashedpassword', 10),
        phone: 987654321,
        country: 'USA',
        address: '456 Elm St',
        city: 'Los Angeles',
        admin: false, // Asegurar que el campo admin sea falso por defecto
      },
    ];

    await this.userRepository.save(users);
  }
}
