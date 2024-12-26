// src/auth/jwt-payload.interface.ts
export interface JwtPayload {
  username: string;
  sub: string; // ID del usuario
  admin: boolean; // Campo admin que determinamos al loguearse
}
