import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryRepository {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<cloudinary.UploadApiResponse | cloudinary.UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream((error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        })
        .end(file.buffer);
    });
  }
}
