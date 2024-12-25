import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/CreateUserDto'; // DTO para crear usuario
import { LoginUserDto } from './Auth.dto'; // DTO para login
import { User } from '../entities/Users.entitiy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signUp(@Body() createUserDto: CreateUserDto) {
    // Llamamos al servicio de signUp
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;

    // Llamar al servicio de autenticación para iniciar sesión
    return this.authService.signIn(email, password);
  }
}
