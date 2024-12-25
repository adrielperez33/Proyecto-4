export interface JwtPayload {
  username: string;
  sub: string; // El 'sub' es generalmente el ID del usuario
}
