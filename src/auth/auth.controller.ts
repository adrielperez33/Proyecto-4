import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../entities/Users.entitiy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(
    @Body() signInDto: { email: string; password: string },
  ): Promise<User> {
    const { email, password } = signInDto;
    const result = await this.authService.signIn(email, password);
    return result; // Retorna el usuario completo
  }
}
