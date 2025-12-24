import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validateMiddleware } from "../middlewares/validateMiddleware";
import { loginSchema, registerSchema } from "../shared/schemas/auth.schema";


const router = new Router() 

router.post('/signup', validateMiddleware(registerSchema), UserController.registration)
router.post('/signin', validateMiddleware(loginSchema),   UserController.logIn)
router.post('/logout', UserController.logOut)
router.post('/update', UserController.logOut)


export default router