import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './auth.dto';
import { UsersRepository } from 'src/users/users.repository';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authServices: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}
  @Get()
  getAuth() {
    return this.authServices.getAuth();
  }

  @Post('signin')
  async postAuth(@Body() { email, password }: SignInDto) {
    // Verificar si los campos de email y password fueron proporcionados
    if (!email || !password) {
      throw new HttpException(
        'Completa todos los campos',
        HttpStatus.BAD_REQUEST,
      );
    } 

    // Buscar al usuario por email
    // const user = await this.usersRepository.getUserByEmail(email);

    // Si el usuario no existe, retornar un error
    // if (!user) {
    //   throw new HttpException(
    //     'Email o password incorrectos',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }

    // Verificar la contraseña (esto normalmente debería hacerse con hashing)
    // if (user.password !== password) {
    //   throw new HttpException(
    //     'Email o password incorrectos',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

    // Si el email y la contraseña son válidos, retornar el usuario sin la contraseña
    // return this.usersRepository.omitPassword(user);
  }
}
