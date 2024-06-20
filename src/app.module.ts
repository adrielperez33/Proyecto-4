import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'; // Asegúrate de importar aquí
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { UserController } from './modules/users/users.controller';
import { ProductController } from './modules/products/products.controller';
import { UserService } from './modules/users/users.service';
import { ProductService } from './modules/products/products.service';
import { UserRepository } from './modules/users/user.repository';
import { ProductRepository } from './modules/products/product.repository';

@Module({
  imports: [ProductsModule, UsersModule, AuthModule],
  controllers: [AppController, UserController, ProductController],
  providers: [AppService, UserService, ProductService, UserRepository, ProductRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
