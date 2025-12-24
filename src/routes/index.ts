import {Router} from "express";
import userRouter from "./userRouter";
const router = new Router()


router.use('/user', userRouter)

export default router
