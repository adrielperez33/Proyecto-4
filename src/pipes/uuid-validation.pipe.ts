import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator'; // Validar si es un UUID

@Injectable()
export class UUIDValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!isUUID(value)) {
      throw new BadRequestException('Formato de UUID inválido');
    }
    return value;
  }
}
