import { Router } from "express";
import { ProductController } from "../controllers/productController";


const router = new Router() 

router.get('/', ProductController.getCategories)
router.get(`/:categoryName`,  ProductController.getProductsByCategory)
router.get(`/brand/:brandName`,  ProductController.getProductsByBrand)
router.get(`/:categoryName/:productName`,  ProductController.getProduct)

export default router