import type { NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';
import { ApiError } from '../errors/apiError';
import type { Request } from 'express';
import type { Response } from 'express';

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }; // ключ — имя куки
  user?: object;
}

interface AccessTokenPayload extends JwtPayload {
  id: number;
}

export const authMiddleware = (req: RequestWithCookies, res: Response, next: NextFunction) => {
  const token = req.cookies?.sessionToken;
  if (!token) {
    throw ApiError.unauthorized();
  }

  try {
    const payload = verify(token, process.env.JWT_SECRET!) as AccessTokenPayload;
    req.user = payload;
    next();
  } catch (error) {
    console.error('Auth Error', error);
    throw ApiError.unauthorized();
  }
};
