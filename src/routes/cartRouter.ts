import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validateMiddleware } from "../middlewares/validateMiddleware";
import { CartController } from '../controllers/cartController';




const router = new Router() 

router.get('/', authMiddleware,  CartController.getCart)
router.post('/', authMiddleware,  CartController.addToCart)
router.delete('/', authMiddleware,  CartController.deleteFromCart)
router.patch('/', authMiddleware,  CartController.updateCart)



export default router