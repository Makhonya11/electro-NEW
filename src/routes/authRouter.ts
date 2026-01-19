
import { Router } from "express";



const router = new Router() 

router.post('/refresh', AuthController.refreshToken)


export default router