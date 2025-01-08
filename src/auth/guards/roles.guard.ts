import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RolesGuard {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization) {
      throw new HttpException(
        'Falta el encabezado de autorización',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const token = authorization.split(' ')[1];
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      console.log('Token decodificado:', decodedToken);

      // Buscar al usuario por el ID (sub) del token
      const user = await this.usersService.findById(decodedToken.sub);

      console.log('Buscando usuario con ID:', decodedToken.sub);
      console.log('Usuario encontrado:', user);

      if (!user) {
        throw new HttpException(
          'Usuario no encontrado',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Verificar si el usuario es admin
      if (!user.admin) {
        throw new HttpException(
          'No tienes permiso para acceder a este recurso',
          HttpStatus.FORBIDDEN, // 403 - Permiso denegado
        );
      }

      return true;
    } catch (error) {
      console.error('Error al validar token:', error);

      if (error?.response === 'No tienes permiso para acceder a este recurso') {
        // Si el error fue relacionado con permisos, se lanza el 403
        throw new HttpException(
          'No tienes permiso para acceder a este recurso',
          HttpStatus.FORBIDDEN, // 403 - Permiso denegado
        );
      }

      // Si el error fue otro, se lanza el 401 (Token inválido)
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }
  }
}
