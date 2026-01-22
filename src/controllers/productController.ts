import type { Request, Response } from 'express';
import { productService } from '../services/productService';
import { ApiError } from '../errors/apiError';

interface ProductData {
  productId?: string;
  categoryId?: string;
  brandId?: string;
}

export class ProductController {
  static async getCategories(req: Request, res: Response) {
    const categories = await productService.getCategories();
    return res.json(categories);
  }

  static async getProductsByCategory(req: Request, res: Response) {
    const id = (req.body as ProductData).categoryId;
    const { categoryName } = req.params;
    console.log(categoryName);

    if (!id) {
      throw ApiError.badRequest('Необходимо указать категорию');
    }

    const products = await productService.getProductsByCategory(id);
    return res.json(products);
  }

  static async getProductsByBrand(req: Request, res: Response) {
    const id = (req.body as ProductData).brandId;
    const { brandName } = req.params;
    console.log(brandName);

    if (!id) {
      throw ApiError.badRequest('Необходимо указать бренд');
    }

    const products = await productService.getProductsByBrand(id);
    return res.json(products);
  }

  static async getProduct(req: Request, res: Response) {
    const productId = (req.body as ProductData).productId;
    const { productName, categoryName } = req.params;

    console.log(productName, categoryName);

    if (!productId) {
      throw ApiError.badRequest('Необходимо указать продукт');
    }

    const product = await productService.getProduct(productId);
    return res.json(product);
  }
}
