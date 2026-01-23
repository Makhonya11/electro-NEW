import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';

const router = Router();

router.get('/', asyncErrorHandler(ProductController.getCategories));
router.get(`/category/:categoryId`, asyncErrorHandler(ProductController.getProductsByCategory));
router.get(`/brand/:brandId`, asyncErrorHandler(ProductController.getProductsByBrand));
router.get(`/category/:categoryId/:productId`, asyncErrorHandler(ProductController.getProduct));

export default router;
