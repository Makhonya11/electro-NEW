import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';
import { OrderController } from './../controllers/orderController';
import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/', authMiddleware, asyncErrorHandler(OrderController.getOrders));
router.get('/:id', authMiddleware, asyncErrorHandler(OrderController.getOrderById));
router.post('/', authMiddleware, asyncErrorHandler(OrderController.create));
router.patch('/:id/cancel', authMiddleware, asyncErrorHandler(OrderController.cancel));
router.patch('/:id', authMiddleware, asyncErrorHandler(OrderController.updateStatus));

export default router;
