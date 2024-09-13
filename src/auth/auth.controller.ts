import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @Get()
  getAuth() {
    return this.authServices.getAuth();
  }
}
