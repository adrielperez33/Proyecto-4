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
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Falta el header de autorización');
    }

    const [type, credentials] = authHeader.split(' ');

    if (type !== 'Basic' || !credentials) {
      throw new UnauthorizedException(
        'Formato de header de autorización inválido',
      );
    }

    const [email, password] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':');

    if (!email || !password) {
      throw new UnauthorizedException(
        'Formato de header de autorización inválido',
      );
    }

    return true;
  }
}
