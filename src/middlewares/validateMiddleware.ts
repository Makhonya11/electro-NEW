import type { NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import type { Request } from 'express';
import type { Response } from 'express';
import { ApiError } from '../errors/apiError';

export const validateMiddleware = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw ApiError.badRequest();
    }
    req.body = result.data;
    console.log(result);
    next();
  } catch (error) {
    console.error('validateMiddleware ERROR', error);
  }
};
