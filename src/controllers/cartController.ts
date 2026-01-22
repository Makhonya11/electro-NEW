import type { Request, Response } from 'express';
import { cartService } from '../services/cartService';
import { ApiError } from '../errors/apiError';

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }; // ключ — имя куки
  user?: {
    id: number;
  };
}

interface ProductData {
  productId: string;
  quantity?: string;
}

export class CartController {
  static async getCart(req: RequestWithCookies, res: Response) {
    const userId = req.user?.id;
    let cartToken = req.cookies.cartToken;

    let cart;

    if (!cartToken && !userId) {
      cartToken = crypto.randomUUID();

      res.cookie('cartToken', cartToken, {
        httpOnly: true,
        sameSite: 'lax',
      });
    }
    cart = await cartService.getCart(cartToken, userId);

    return res.json(cart);
  }

  static async addToCart(req: RequestWithCookies, res: Response) {
    const userId = req.user?.id;
    let cartToken = req.cookies.cartToken;
    const product = (req.body as ProductData).productId;

    if (!product) {
      throw ApiError.badRequest('Необходимо указать productId');
    }

    const productId = +product;

    if (!cartToken && !userId) {
      cartToken = crypto.randomUUID();

      res.cookie('cartToken', cartToken, {
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    const cart = await cartService.addToCart(productId, cartToken, userId);

    res.json(cart);
  }

  static async deleteFromCart(req: RequestWithCookies, res: Response) {
    const userId = req.user?.id;
    const cartToken = req.cookies.cartToken;
    const product = (req.body as ProductData).productId;

    if (!product) {
      throw ApiError.badRequest('Необходимо указать productId');
    }

    const productId = +product;

    const cart = await cartService.deleteFromCart(productId, cartToken, userId);

    return res.json(cart);
  }

  static async updateCart(req: RequestWithCookies, res: Response) {
    const cartToken = req.cookies.cartToken;
    const userId = req.user?.id;
    const { productId, quantity } = req.body as ProductData;

    if (!productId || !quantity) {
      throw ApiError.badRequest('Необходимо указать продукт и количество');
    }

    const cart = await cartService.updateCart(+productId, cartToken, +quantity, userId);

    return res.json(cart);
  }
}
