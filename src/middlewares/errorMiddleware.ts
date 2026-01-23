import type { ErrorRequestHandler, Response } from 'express';

import { Prisma } from '@prisma/client';
import { ApiError } from '../errors/apiError';

export const errorMiddleware: ErrorRequestHandler = (err, req, res: Response) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }

  // 🔹 Prisma: unique constraint
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      //const field = err.meta?.target
      return res.status(409).json({
        message: `Такая запись  уже существует`,
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        message: 'Запись не найдена',
      });
    }
  }

  // 🔹 Prisma: validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: 'Некорректные данные запроса',
    });
  }

  //console.error(err);

  return res.status(500).json({
    message: 'Непредвиденная ошибка сервера',
  });
};
