import { Request, Response, NextFunction } from 'express';
import { format } from 'date-fns';

export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
  const now = new Date();
  const formattedDate = format(now, 'yyyy-MM-dd / HH:mm');
  const logMessage = `Hora: [${formattedDate}] Metodo: ${req.method} Ruta: ${req.originalUrl}`;
  console.log(logMessage);

  // Validar que req.body esté presente
  if (
    (req.method === 'POST' || req.method === 'PUT') &&
    req.body &&
    Object.keys(req.body).length > 0
  ) {
    const { email, name, password } = req.body;

    if (req.method === 'POST') {
      if (!email || !name || !password) {
        return res.status(400).json({
          message:
            'Campos email, name y password son obligatorios para crear un usuario.',
        });
      }
    }

    if (email && typeof email !== 'string') {
      return res
        .status(400)
        .json({ message: 'El email debe ser una cadena de texto.' });
    }
    if (name && typeof name !== 'string') {
      return res
        .status(400)
        .json({ message: 'El nombre debe ser una cadena de texto.' });
    }
    if (password && typeof password !== 'string') {
      return res
        .status(400)
        .json({ message: 'La contraseña debe ser una cadena de texto.' });
    }
  }

  next();
}
