
import { Router } from "express";
import { AuthController } from "../controllers/authController";



const router = new Router() 

router.post('/refresh', AuthController.refreshToken)


export default router