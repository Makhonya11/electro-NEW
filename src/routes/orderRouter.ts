import { OrderController } from './../controllers/orderController';
import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from "express";

const router = new Router() 

router.get('/', authMiddleware, OrderController.getOrders)
router.get('/:id', authMiddleware, OrderController.getOrderById)
router.post('/', authMiddleware, OrderController.create)
router.patch('/:id/cancel', authMiddleware, OrderController.cancel)
router.patch('/:id', authMiddleware, OrderController.updateStatus)

export default router