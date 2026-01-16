import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from "express";
import { CartController } from '../controllers/cartController';
import { optionalAuthMiddleware } from '../middlewares/optionalAuthMiddleware';


const router = new Router() 

router.get('/', optionalAuthMiddleware, CartController.getCart)
router.post('/', optionalAuthMiddleware, CartController.addToCart)
router.delete('/', optionalAuthMiddleware, CartController.deleteFromCart)
router.patch('/', optionalAuthMiddleware, CartController.updateCart)

export default router