import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUsers() {
    return 'estoy en el get de users';
  }
}
