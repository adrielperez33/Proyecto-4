import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { ProductsModule } from '../products/products.module';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    ProductsModule,
    MulterModule.register({
      storage: memoryStorage(), // Almacena los archivos en memoria como buffer
    }),
  ],
  controllers: [CloudinaryController],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
