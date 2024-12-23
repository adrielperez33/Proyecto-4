import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';

@Module({
  imports: [
    MulterModule.register(multerConfig), // Register the multer config
  ],
})
export class MulterConfigModule {}
