import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validateMiddleware } from "../middlewares/validateMiddleware";
import { loginSchema, registerSchema } from "../shared/schemas/auth.schema";

import { uploadAvatarMiddleware } from '../middlewares/imageValidateMiddleware';


const router = new Router() 

router.post('/signup', validateMiddleware(registerSchema), UserController.registration)
router.post('/signin', validateMiddleware(loginSchema),   UserController.logIn)
router.post('/logout', UserController.logOut)
router.patch('/update', authMiddleware, uploadAvatarMiddleware,  UserController.updateProfile)
router.get('/me', authMiddleware,  UserController.getProfile)
router.get('/favorite', authMiddleware,  UserController.getFavorites)
router.post('/favorite', authMiddleware,  UserController.addToFavorites)
router.delete('/favorite', authMiddleware,  UserController.deleteFromFavorites)
router.get('/orders', authMiddleware,  UserController.getOrders)



export default router