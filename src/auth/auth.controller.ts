// import { Body, Controller, Get, Post } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { Auth } from 'src/entities/Auth.entity';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Get()
//   getAuth(): string {
//     return 'estas en el get de auth';
//   }

//   @Post('signin')
//   async autenticacion(@Body() auth: Auth) {
//     const { email, password } = auth;

//     if (!email || !password) {
//       return 'falta el email o el password';
//     }

//     const user = await this.authService.validateUser(email, password);
//     if (!user) {
//       return 'Email o password incorrectos';
//     }
//     return this.authService.login(user)
//   }
// }
