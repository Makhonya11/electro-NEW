import { asyncErrorHandler } from './../middlewares/asyncErrorHandler';

import { Router } from "express";
import { AuthController } from "../controllers/authController";



const router = new Router() 

router.post('/refresh',  asyncErrorHandler(AuthController.refreshToken))


export default router