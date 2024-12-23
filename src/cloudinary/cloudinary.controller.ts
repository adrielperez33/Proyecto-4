import {
  BadRequestException,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ProductService } from '../products/productsDb. services'; // Asegúrate de que el nombre coincide con el que exportas

@Controller('cloudinary')
export class CloudinaryController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly productService: ProductService, // Cambia el nombre aquí también
  ) {}

  @Post('uploadImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó un archivo');
    }
    console.log('Archivo recibido:', file);

    const uploadResult = await this.cloudinaryService.uploadImage(file);
    console.log('Resultado de la carga:', uploadResult);

    const imageUrl = uploadResult.secure_url;
    return this.productService.updateProductImage(id, imageUrl);
  }
}
