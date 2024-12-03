import { NextFunction, Request, Response } from 'express';

export function LoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { method, originalUrl } = req;
  const timestamp = new Date().toISOString().split('T')[0];
  const hours = String(new Date().getHours()).padStart(2, '0');
  const minutes = String(new Date().getMinutes()).padStart(2, '0');
  console.log(
    `Estas en la ruta [${originalUrl}] usando el metodo ${method} el ${timestamp} a las ${hours}:${minutes}`,
  );
  next();
}
