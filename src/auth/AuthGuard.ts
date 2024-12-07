import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException(
        'No tienes autorización para entrar aquí',
      );
    }

    // Verifica que el header tenga la estructura Basic <email>:<password>
    const [type, credentials] = authorization.split(' ');

    if (type !== 'Basic' || !credentials) {
      throw new UnauthorizedException(
        'Estructura del encabezado de autorización inválida',
      );
    }

    const [email, password] = credentials.split(':');

    if (!email || !password) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    return true;
  }
}
