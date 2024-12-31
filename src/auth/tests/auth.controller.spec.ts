import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../../users/CreateUserDto';
import { LoginUserDto } from '../Auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn().mockResolvedValue({ email: 'john@example.com' }),
            signIn: jest.fn().mockResolvedValue({ accessToken: 'token' }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
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
    await authController.signUp(createUserDto);
    expect(authService.signUp).toHaveBeenCalledWith(createUserDto);
  });

  it('should sign in a user', async () => {
    const loginUserDto: LoginUserDto = {
      email: 'john@example.com',
      password: 'password',
    };
    const result = await authController.signIn(loginUserDto);
    expect(authService.signIn).toHaveBeenCalledWith(
      loginUserDto.email,
      loginUserDto.password,
    );
    expect(result).toEqual({ accessToken: 'token' });
  });
});
