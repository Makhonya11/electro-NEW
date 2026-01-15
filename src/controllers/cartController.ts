import { Request, Response } from "express";
import { userService } from "../services/userService";
import { productService } from "../services/productService";
import { hashSync } from "bcrypt";
import { cartService } from "../services/cartService";

export class CartController {
    static async getCart (req:Request, res: Response) {
      try {
          //const userId = req.user?.id
          let cartToken = req.cookies.cartToken

          if (!cartToken) {
             cartToken = hashSync('cartToken', 10)

             res.cookie('cartToken', cartToken, {
                  httpOnly:true,
                  sameSite:'lax',
              })
          } 

          const cart = await cartService.getCart( cartToken)


          return res.json(cart)

      } catch (error) {
          console.error('getCart ERROR',error)
      }
  }

      static async addToCart (req:Request, res: Response) {
        try {
            //const userId = req.user?.id
            let cartToken = req.cookies.cartToken
            if (!cartToken) {
                cartToken = hashSync('cartToken', 10)

                 res.cookie('cartToken', cartToken, {
                  httpOnly:true,
                  sameSite:'lax',
              })
            } 

          const productId = +req.body.productId
            
          const cart = await cartService.addToCart(productId, cartToken)

            res.json(cart)


        } catch (error) {
            console.error('addToCart ERROR',error)
        }
    }

      static async deleteFromCart (req:Request, res: Response) {
        try {
            //const userId = req.user?.id
            const cartToken = req.cookies.cartToken

            const productId = +req.body.productId
            
           const cart =  await cartService.deleteFromCart( productId, cartToken)

           return res.json(cart)

        } catch (error) {
            console.error('deleteFromCart ERROR',error)
        }
    }

    // ДОПИСВТЬ ЭТОТ МЕТОД
      static async updateCart (req:Request, res: Response) {
        try {
            //const userId = req.user?.id
            const cartToken = req.cookies.cartToken

            const productId = +req.body.productId

            const quantity = +req.body.quantity
            
            const cart = await cartService.updateCart( productId, cartToken, quantity)

            return res.json(cart)

        } catch (error) {
            console.error('updateCart ERROR',error)
        }
    }
}

 
