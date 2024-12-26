import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'; // Clave para almacenar la metadata de roles
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); // Decorador que asigna roles
