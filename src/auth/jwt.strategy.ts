import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface'; // Asegúrate de que está importado correctamente

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el JWT del header de autorización
      ignoreExpiration: false, // No ignoramos la expiración del token
      secretOrKey: process.env.JWT_SECRET, // Usamos la clave secreta configurada en el entorno
    });
  }

  // Validar el JWT y devolver el payload
  async validate(payload: JwtPayload) {
    // Aquí devolvemos el contenido del payload para que pueda ser utilizado
    return {
      userId: payload.sub, // El ID del usuario
      username: payload.username, // El nombre de usuario
      admin: payload.admin, // El campo admin del usuario
    };
  }
}
