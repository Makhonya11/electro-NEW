
import { authMiddleware } from './../middlewares/authMiddleware';
import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validateMiddleware } from "../middlewares/validateMiddleware";
import { loginSchema, registerSchema } from "../shared/schemas/auth.schema";

import { uploadAvatarMiddleware } from '../middlewares/imageValidateMiddleware';
import { asyncErrorHandler } from '../middlewares/asyncErrorHandler';


const router = new Router() 

router.post('/signup', validateMiddleware(registerSchema), asyncErrorHandler(UserController.registration))
router.post('/signin', validateMiddleware(loginSchema),   asyncErrorHandler(UserController.logIn))
router.post('/logout', authMiddleware, asyncErrorHandler(UserController.logOut))
router.patch('/update', authMiddleware, uploadAvatarMiddleware,  asyncErrorHandler(UserController.updateProfile))
router.get('/me', authMiddleware,  asyncErrorHandler(UserController.getProfile))
router.get('/favorite', authMiddleware,  asyncErrorHandler(UserController.getFavorites))
router.post('/favorite', authMiddleware,  asyncErrorHandler(UserController.addToFavorites))
router.delete('/favorite', authMiddleware,  asyncErrorHandler(UserController.deleteFromFavorites))



export default router