import { asyncErrorHandler } from './../asyncErrorHandler';
import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validateMiddleware } from "../middlewares/validateMiddleware";
import { loginSchema, registerSchema } from "../shared/schemas/auth.schema";

import { uploadAvatarMiddleware } from '../middlewares/imageValidateMiddleware';


const router = new Router() 

router.post('/signup', validateMiddleware(registerSchema), asyncErrorHandler(UserController.registration))
router.post('/signin', validateMiddleware(loginSchema),   asyncErrorHandler(UserController.logIn))
router.post('/logout', asyncErrorHandler(UserController.logOut))
router.patch('/update', authMiddleware, uploadAvatarMiddleware,  asyncErrorHandler(UserController.updateProfile))
router.get('/me', authMiddleware,  asyncErrorHandler(UserController.getProfile))
router.get('/favorite', authMiddleware,  asyncErrorHandler(UserController.getFavorites))
router.post('/favorite', authMiddleware,  asyncErrorHandler(UserController.addToFavorites))
router.delete('/favorite', authMiddleware,  asyncErrorHandler(UserController.deleteFromFavorites))
router.get('/orders', authMiddleware,  asyncErrorHandler(UserController.getOrders))



export default router