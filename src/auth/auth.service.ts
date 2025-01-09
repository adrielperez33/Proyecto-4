import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/CreateUserDto';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/Users.entitiy';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<Omit<User, 'password' | 'admin'>> {
    // Llamamos al servicio para crear el usuario
    const user = await this.usersService.createUser(createUserDto);

    // Elimina la propiedad password y admin solo cuando no se desea retornar al cliente
    const { password, admin, ...userWithoutSensitiveData } = user;

    return userWithoutSensitiveData;
  }

  // src/auth/auth.service.ts
  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    try {
      // Buscar al usuario por su email
      const user = await this.usersService.findByEmail(email);

      // Si no existe el usuario, lanzamos un error
      if (!user) {
        throw new UnauthorizedException(
          'El usuario no existe o La contraseña es incorrecta',
        );
      }

      // Verificar si la contraseña ingresada coincide con la almacenada
      const passwordMatch = await bcrypt.compare(password, user.password);

      // Si la contraseña no coincide, lanzamos un error
      if (!passwordMatch) {
        throw new UnauthorizedException(
          'El usuario no existe o La contraseña es incorrecta',
        );
      }

      // Crear el payload para el JWT incluyendo el campo admin
      const payload = {
        username: user.email.split('@')[0], // Nombre de usuario
        sub: user.id, // ID del usuario
        admin: user.admin, // Agregar el campo admin
      };

      // Firmar el token
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      });

      return { accessToken };
    } catch (error) {
      // Registrar el error para debugging
      console.error('Error durante el inicio de sesión del usuario:', error);

      // Lanzar una excepción adecuada para los errores internos
      if (error instanceof UnauthorizedException) {
        throw error; // Si es UnauthorizedException, lo lanzamos directamente
      }

      // Para otros errores internos, lanzamos InternalServerErrorException
      throw new InternalServerErrorException(
        'Ocurrió un error durante el inicio de sesión',
      );
    }
  }
}
