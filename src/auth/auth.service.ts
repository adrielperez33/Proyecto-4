import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/Users.entitiy';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UsersRepository) {}

  async validateUser(email: string, password: string): Promise<User> | null {
    const user = await this.userRepository.findByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  login(user: User) {
    return { message: 'acceso permitido, bienvenido', user };
  }
}
