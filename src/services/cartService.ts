import { hashSync } from "bcrypt"
import { prisma } from "../../prisma/prisma-client"


class CartService {

        async getCart (cartToken: string) {

                let cart = await prisma.cart.findUnique({
                    where: {
                        token: cartToken
                    }
                })

               //const token = hashSync('cartToken', 10)
              if (!cart) {
                    cart = await prisma.cart.create({
                    data: {
                        token: cartToken
                    }
                })
              }

                return cart
        }

    // ДОРАБОТАТЬ ЭТОТ МЕТОД ПРОВЕРИ СУЩНОСТЬ В ПРИЗМЕ
        async addToCart( productId: string, cartToken: string) {
          
          let cart = await prisma.cart.findFirst ({
            where: {
               // userId: Number(userId),
                token: cartToken
            }
          })
    
          if (!cart) {
             cart = await prisma.cart.create({
              data: {
                token: cartToken
              }
            })
          }
    
           await prisma.cartItem.create({
            data: {
              cartId: cart?.id as number,
              productId: Number(productId)
            }
          }) 
    
          return cart
        }

        async deleteFromCart( productId: string, cartToken: string) {
          
          let cart = await prisma.cart.findFirst ({
            where: {
               // userId: Number(userId),
                token: cartToken
            }
          })
    
           await prisma.cartItem.delete({
            where: {
              cartId_productId: {
                cartId: cart?.id as number,
                productId: Number(productId)
              }
            }
          }) 
    
          return cart
        }

        async updateCart (productId: string, cartToken: string, quantity: string) {
             const cart = await prisma.cart.findFirst ({
            where: {
                token: cartToken
            }
          })

           await prisma.cartItem.update ({
            where: {
              cartId_productId: {
                cartId: cart?.id as number,
                productId: Number(productId)
              }
            },
            data: {
                quantity: +quantity
            }
          })

          return cart
        }


    
}

export const cartService = new CartService ()
