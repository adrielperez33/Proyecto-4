import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadStream } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    // Validación del archivo recibido
    if (!file || !file.buffer) {
      throw new BadRequestException('El archivo no contiene datos');
    }

    // Configuración dinámica de Cloudinary en caso de que no esté previamente configurado
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Verificación de la configuración activa de Cloudinary
    console.log('Configuración de Cloudinary:', cloudinary.config());

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream: UploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(
              new BadRequestException('Error al subir la imagen a Cloudinary'),
            );
          } else {
            resolve(result as UploadApiResponse);
          }
        },
      );

      // Conversión del buffer a un flujo legible y conexión con el stream de subida
      const readable = new Readable();
      readable._read = () => {};
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }
}
