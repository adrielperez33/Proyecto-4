import { Request, Response, NextFunction } from 'express';
import { format } from 'date-fns';

export function loggerGlobal(
  req: Request,
  res: Response,
  next: (error?: Error | NextFunction) => void,
) {
  const now = new Date();
  const formattedDate = format(now, 'yyyy-MM-dd / HH:mm');
  const logMessage = `Hora: [${formattedDate}] Metodo: ${req.method} Ruta: ${req.originalUrl}`;
  console.log(logMessage);
  next();
}
