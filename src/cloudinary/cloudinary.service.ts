import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Express } from 'express';
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

    // Promesa para manejar el proceso de carga
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, uploadResult) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(
              new BadRequestException('Error al subir la imagen a Cloudinary'),
            );
          } else {
            resolve(uploadResult as UploadApiResponse); // Resuelve la promesa con el resultado de la carga
          }
        },
      );

      // Convertir el buffer del archivo a un stream y cargarlo
      const readable = new Readable();
      readable._read = () => {}; // No es necesario implementar el método _read en este caso
      readable.push(file.buffer);
      readable.push(null); // Finaliza el stream
      readable.pipe(uploadStream);
    });
  }
}
