import { asyncErrorHandler } from './../asyncErrorHandler';
import { Router } from "express";
import { ProductController } from "../controllers/productController";


const router = new Router() 

router.get('/', asyncErrorHandler(ProductController.getCategories))
router.get(`/:categoryName`,  asyncErrorHandler(ProductController.getProductsByCategory))
router.get(`/brand/:brandName`,  asyncErrorHandler(ProductController.getProductsByBrand))
router.get(`/:categoryName/:productName`,  asyncErrorHandler(ProductController.getProduct))

export default router