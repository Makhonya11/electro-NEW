import {Router} from "express";
import userRouter from "./userRouter";
import cartRouter from "./cartRouter";
import productRouter from "./productRouter";
import orderRouter from "./orderRouter";
import authRouter from "./authRouter";

const router = new Router()


router.use('/user', userRouter)
router.use('/cart', cartRouter)
router.use('/catalog', productRouter)
router.use('/order', orderRouter)
router.use('/auth', authRouter)


export default router
