import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const multerConfig = {
  storage: memoryStorage(), // Configure in-memory storage to work with buffers
  fileFilter: (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    console.log('Validating MIME type:', file.mimetype);
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new BadRequestException('Invalid image type'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
};
