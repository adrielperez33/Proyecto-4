import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageTypeValidationPipe implements PipeTransform {
  async transform(file: Express.Multer.File) {
    if (!file || !file.mimetype || !file.buffer) {
      throw new BadRequestException(
        'No se pudo determinar el tipo MIME del archivo.',
      );
    }

    console.log('Tipo MIME recibido por multer:', file.mimetype);

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    // Verifica el tipo MIME informado por Multer
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de imagen inválido. Solo se permiten: jpg, jpeg, png.',
      );
    }

    // Carga dinámica del módulo ESM
    const imageType = (await import('image-type')).default;
    const image = await imageType(file.buffer); // Use `await` to resolve the promise
    if (!image || !allowedTypes.includes(image.mime)) {
      throw new BadRequestException(
        'El archivo no es una imagen válida o su formato no es permitido (jpg, jpeg, png).',
      );
    }

    return file; // Si todo es válido, retorna el archivo
  }
}
