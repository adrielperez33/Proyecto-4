import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../users/CreateUserDto';
import { User } from '../../entities/Users.entitiy';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest
              .fn()
              .mockResolvedValue({ email: 'john@example.com' } as User),
            findByEmail: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should sign up a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      confirmPassword: 'password',
      phone: 1234567890,
      country: 'USA',
      address: '123 Main St',
      city: 'Anytown',
      admin: false,
    };
    const user = await authService.signUp(createUserDto);
    expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    expect(user).toEqual(
      expect.objectContaining({
        email: 'john@example.com',
      }),
    );
  });

  it('should sign in a user', async () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password', 10),
      phone: 1234567890,
      country: 'USA',
      address: '123 Main St',
      city: 'Anytown',
      admin: false,
      orders: [],
    };
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);

    const result = await authService.signIn('john@example.com', 'password');
    expect(result).toEqual({ accessToken: 'token' });
  });

  it('should throw UnauthorizedException if email is invalid', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
    await expect(
      authService.signIn('invalid@example.com', 'password'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password', 10),
      phone: 1234567890,
      country: 'USA',
      address: '123 Main St',
      city: 'Anytown',
      admin: false,
      orders: [],
    };
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);

    await expect(
      authService.signIn('john@example.com', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
