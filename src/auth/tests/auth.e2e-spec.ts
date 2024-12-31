import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from './auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/Users.entitiy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/signup (POST)', async () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      phone: 1234567890,
      country: 'USA',
      address: '123 Main St',
      city: 'Anytown',
    };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(createUserDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            email: 'john@example.com',
          }),
        );
      });
  });

  it('/auth/signin (POST)', async () => {
    const user = new User();
    user.name = 'John Doe';
    user.email = 'john@example.com';
    user.password = await bcrypt.hash('password', 10);
    user.phone = 1234567890;
    user.country = 'USA';
    user.address = '123 Main St';
    user.city = 'Anytown';
    await userRepository.save(user);

    const loginUserDto = {
      email: 'john@example.com',
      password: 'password',
    };
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send(loginUserDto)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          accessToken: expect.any(String),
        });
      });
  });
});
