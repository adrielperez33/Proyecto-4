import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageSizeValidationPipe implements PipeTransform {
  private readonly maxFileSize = 200 * 1024; // 200 KB

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'No se proporcionó un archivo para validar.',
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `El tamaño del archivo (${(file.size / 1024).toFixed(2)} KB) excede el límite permitido de ${this.maxFileSize / 1024} KB.`,
      );
    }

    return file;
  }
}
