import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import * as dotenv from 'dotenv';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  // Usar middleware para el logger
  app.use(LoggerMiddleware);

  // Usar pipe global para la validación de datos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 422, // Unprocessable Entity
      exceptionFactory: (errors) => {
        const errorMessages = errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
        }));
        return new BadRequestException({
          statusCode: 422,
          message: 'Validation failed',
          errors: errorMessages,
        });
      },
    }),
  );
  // Configuraciones de entorno
  console.log('PORT:', process.env.PORT);
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_USERNAME:', process.env.DB_USERNAME);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
  console.log('DB_DATABASE:', process.env.DB_DATABASE);

  // Seeders para categorías y productos
  await app.getHttpAdapter().getInstance().get('/categories/seeder');
  await app.getHttpAdapter().getInstance().get('/products/seeder');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
