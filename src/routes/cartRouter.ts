import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validateMiddleware } from "../middlewares/validateMiddleware";
import { loginSchema, registerSchema } from "../shared/schemas/auth.schema";




const router = new Router() 


router.get('/cart', authMiddleware,  CartController.getCart)
router.post('/cart/items', authMiddleware,  CartController.addToCart)
router.delete('/cart/items', authMiddleware,  CartController.deleteFromCart)
router.patch('/cart/items', authMiddleware,  CartController.updateCart)



export default router