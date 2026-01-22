import { verify } from 'jsonwebtoken';
import { authService } from './../services/authService';
import type { Request, Response } from 'express';
import { ApiError } from '../errors/apiError';

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }; // ключ — имя куки
  user?: object;
}

export class AuthController {
  static async refreshToken(req: RequestWithCookies, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw ApiError.unauthorized();
    }

    const userData = verify(refreshToken, process.env.REFRESH_SECRET!);
    if (typeof userData !== 'object' || !('id' in userData)) {
      throw ApiError.unauthorized();
    }
    const userId = +userData?.id;

    const accessToken = await authService.refreshToken(userId, refreshToken);

    if (accessToken) {
      res.cookie('sessionToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
      });
    }
    return res.status(200).json({ message: 'Access token обновлён' });
  }
}
