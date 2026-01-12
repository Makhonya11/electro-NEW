import { Router } from "express";
import { ProductController } from "../controllers/productController";


const router = new Router() 

router.get('/catalog',  ProductController.getCategories)
router.get(`/catalog/:categoryName`,  ProductController.getCategory)
router.get(`/catalog/:categoryName/:productName`,  ProductController.getProduct)



export default router