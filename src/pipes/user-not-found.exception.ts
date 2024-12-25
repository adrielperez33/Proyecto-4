import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('El usuario no existe', HttpStatus.UNAUTHORIZED); // 401 Unauthorized
  }
}
