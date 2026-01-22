import type { NextFunction, RequestHandler } from 'express';
import type { Request } from 'express';
import type { Response } from 'express';

export const asyncErrorHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);
