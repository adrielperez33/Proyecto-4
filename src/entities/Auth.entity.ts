import { IsEmail, IsNotEmpty } from 'class-validator';

export class Auth {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}