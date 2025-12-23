import { Router } from "express";
import { UserController } from "../controllers/userController";


const router = new Router()

router.post('/signup', UserController.registration)
router.post('/signin', UserController.login)
//router.post('/signup', userController.registration)

export default router