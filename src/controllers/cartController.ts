import { Request, Response } from "express";
import { userService } from "../services/userService";
import { productService } from "../services/productService";
import { hashSync } from "bcrypt";
import { cartService } from "../services/cartService";

interface RequestWithAuth extends Request {
    user?: {
        id: number
    }
}

export class CartController {
    static async getCart (req:RequestWithAuth, res: Response) {

          const userId = req.user?.id
          let cartToken = req.cookies.cartToken

          let cart 
 
          if (!cartToken && !userId) {
                 cartToken = crypto.randomUUID()
    
                 res.cookie('cartToken', cartToken, {
                      httpOnly:true,
                      sameSite:'lax',
                  })
                } 
            cart = await cartService.getCart( cartToken, userId)

          return res.json(cart)
  }

      static async addToCart (req:RequestWithAuth, res: Response) {

            const userId = req.user?.id
            let cartToken = req.cookies.cartToken
            const productId = +req.body.productId

             if (!cartToken && !userId) {
                 cartToken = crypto.randomUUID()
    
                 res.cookie('cartToken', cartToken, {
                      httpOnly:true,
                      sameSite:'lax',
                  })
                } 
            
          const cart = await cartService.addToCart(productId, cartToken, userId)

            res.json(cart)
    }

      static async deleteFromCart (req:RequestWithAuth, res: Response) {

            const userId = req.user?.id
            const cartToken = req.cookies.cartToken
            const productId = +req.body.productId
            
            const cart =  await cartService.deleteFromCart( productId, cartToken, userId)

           return res.json(cart)
    }

    // ДОПИСВТЬ ЭТОТ МЕТОД
      static async updateCart (req:RequestWithAuth, res: Response) {

            const cartToken = req.cookies.cartToken
            const userId = req.user?.id
            const productId = +req.body.productId
            const quantity = +req.body.quantity
            
            const cart = await cartService.updateCart( productId, cartToken, quantity, userId)

            return res.json(cart)
    }
}

 
