import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../entities/Users.entitiy';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  // Método de sign-in sin JWT, solo devolviendo el usuario completo
  async signIn(email: string, password: string): Promise<User | undefined> {
    const user = await this.usersService.findOneByEmail(email); // Buscar al usuario por email

    // Verificar si existe el usuario y si la contraseña coincide
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }

    return user; // Devuelve el usuario completo
  }
}
