import type { Request, Response } from 'express';
import { productService } from '../services/productService';
import { ApiError } from '../errors/apiError';

export class ProductController {
  static async getCategories(req: Request, res: Response) {
    const categories = await productService.getCategories();
    return res.json(categories);
  }

  static async getProductsByCategory(req: Request, res: Response) {
    const id = req.params.categoryId;

    if (!id) {
      throw ApiError.badRequest('Необходимо указать категорию');
    }

    const products = await productService.getProductsByCategory(id);
    return res.status(200).json(products);
  }

  static async getProductsByBrand(req: Request, res: Response) {
    const id = req.params.brandId;
    const { brandName } = req.params;
    console.log(brandName);

    if (!id) {
      throw ApiError.badRequest('Необходимо указать бренд');
    }

    const products = await productService.getProductsByBrand(id);
    return res.status(200).json(products);
  }

  static async getProduct(req: Request, res: Response) {
    const productId = req.params.productId;

    if (!productId) {
      throw ApiError.badRequest('Необходимо указать продукт');
    }

    const product = await productService.getProduct(productId);
    return res.status(200).json(product);
  }
}
