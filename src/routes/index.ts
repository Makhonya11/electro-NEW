import {Router} from "express";
import userRouter from "./userRouter";
import cartRouter from "./cartRouter";
import productRouter from "./productRouter";
import orderRouter from "./orderRouter";

const router = new Router()


router.use('/user', userRouter)
router.use('/cart', cartRouter)
router.use('/catalog', productRouter)
router.use('/order', orderRouter)

export default router
