import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from "express";
import { CartController } from '../controllers/cartController';


const router = new Router() 

router.get('/',  CartController.getCart)
router.post('/',  CartController.addToCart)
router.delete('/',  CartController.deleteFromCart)
router.patch('/',  CartController.updateCart)

export default router