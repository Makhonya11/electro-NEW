import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from "express";
import { CartController } from '../controllers/cartController';
import { optionalAuthMiddleware } from '../middlewares/optionalAuthMiddleware';
import { asyncErrorHandler } from '../asyncErrorHandler';


const router = new Router() 

router.get('/', optionalAuthMiddleware, asyncErrorHandler(CartController.getCart))
router.post('/', optionalAuthMiddleware, asyncErrorHandler(CartController.addToCart))
router.delete('/', optionalAuthMiddleware, asyncErrorHandler(CartController.deleteFromCart))
router.patch('/', optionalAuthMiddleware, asyncErrorHandler(CartController.updateCart))

export default router