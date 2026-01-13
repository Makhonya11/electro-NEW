import {Router} from "express";
import userRouter from "./userRouter";
import cartRouter from "./cartRouter";
import productRouter from "./productRouter";

const router = new Router()


router.use('/user', userRouter)
router.use('/cart', cartRouter)
router.use('/catalog', productRouter)

export default router
