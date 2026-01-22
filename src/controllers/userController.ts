import type { Request, Response } from 'express';
import { userService } from '../services/userService';

interface RequestWithAuth extends Request {
  user: {
    id: number;
  };
}

interface LoginUserInput {
  email: string;
  password: string;
}
interface CreateUserInput extends LoginUserInput {
  name: string;
  phone?: string;
}

interface UpdateUserInput extends CreateUserInput {
  image: string;
}

interface ProductData {
  productId: string;
}

export class UserController {
  static async registration(req: Request, res: Response) {
    const data = req.body as CreateUserInput;
    console.log(data);

    const { user, sessionToken, refreshToken } = await userService.registration(data);

    res.cookie('sessionToken', sessionToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return res.json(user);
  }

  static async logIn(req: Request, res: Response) {
    const { email, password } = req.body as LoginUserInput;

    const { sessionToken, user, refreshToken } = await userService.logIn({ email, password });

    res.cookie('sessionToken', sessionToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return res.json(user);
  }

  static async logOut(req: RequestWithAuth, res: Response) {
    const userId = req.user?.id;
    console.log(userId);
    await userService.logOut(userId);

    res.clearCookie('sessionToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      path: '/',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      path: '/',
    });

    return res.status(200).json({ message: 'Logged out' });
  }

  static async updateProfile(req: RequestWithAuth, res: Response) {
    const userData = req.body as UpdateUserInput;
    const userId = req.user?.id;
    const image = req.file?.filename;
    console.log(req.file);

    const user = await userService.updateProfile(userData, userId, image);

    return res.json(user);
  }

  static async getProfile(req: RequestWithAuth, res: Response) {
    const userId = req.user.id;
    const user = await userService.getProfile(userId);

    return res.json(user);
  }

  static async getFavorites(req: RequestWithAuth, res: Response) {
    const userId = req.user.id;
    const favorites = await userService.getFavorites(userId);

    return res.json(favorites);
  }

  static async addToFavorites(req: RequestWithAuth, res: Response) {
    const userId = req.user.id;
    const { productId } = req.body as ProductData;

    await userService.toggleFavorite(userId, productId);

    return res.status(200).json({ message: 'Товар добавлен в избранное' });
  }
  static async deleteFromFavorites(req: RequestWithAuth, res: Response) {
    const userId = req.user.id;
    const { productId } = req.body as ProductData;

    await userService.toggleFavorite(userId, productId);
    return res.status(200).json({ message: 'Товар удален из избранных' });
  }
}
