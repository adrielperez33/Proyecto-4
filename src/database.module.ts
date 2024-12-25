import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Product } from './entities/Products.entity';
import { Category } from './entities/Categories.entity';
import { Order } from './entities/Orders.entitiy';
import { OrderDetail } from './entities/OrderDetail.entity';
import { User } from './entities/Users.entitiy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Product, Category, Order, OrderDetail, User],
        synchronize: true, // Desactiva synchronize temporalmente
        dropSchema: false,
        migrationsRun: true, // Ejecuta migraciones automáticamente
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/migrations',
        },
      }),
      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        return dataSource;
      },
    }),
  ],
})
export class DatabaseModule {}
