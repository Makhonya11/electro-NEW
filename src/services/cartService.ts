import { Product } from './../../node_modules/.prisma/client/index.d';
import { hashSync } from "bcrypt"
import { prisma } from "../../prisma/prisma-client"
import { tr } from "zod/locales"
import { calcCartTotal } from '../utils/calcCartTotal';


class CartService {

  async recalcCart(id: number) {
          const cart = await prisma.cart.findUnique({
            where: {
              id
            },
            include: {
              items: {
                include: {
                  product:true
                }
              }
            }
          })

          if (!cart) {
            throw new Error('Корзина не найдена')
          } 

          const totalAmount = calcCartTotal(cart?.items)

          const updCart = await prisma.cart.update({
            where: {
              id: cart?.id
            },
            data:{
              totalAmount
            },
            include: {
                items: {
                include: {
                  product:true
                }
              }
            }
          })
          return updCart

        }

        async getCart (cartToken: string) {

                let cart = await prisma.cart.findUnique({
                    where: {
                        token: cartToken
                    },
                    include: {
              items: {
                include: {
                  product:true
                }
              }
            }
                })

               //const token = hashSync('cartToken', 10)
              if (!cart) {
                    cart = await prisma.cart.create({
                    data: {
                        token: cartToken
                    },
                     include: {
              items: {
                include: {
                  product:true
                }
              }
            }
                })
              }

                return this.recalcCart(cart.id)
        }

        async addToCart( productId: number, cartToken: string) {
          
          let cart = await prisma.cart.findUnique ({
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
            
            const findCartItem = await prisma.cartItem.findUnique({
              where: {
                cartId_productId: {
                  cartId: cart.id,
                  productId: +productId
                }
              }
            })

            if (findCartItem) {
              await prisma.cartItem.update({
                where: {
                   cartId_productId: {
                     cartId: cart.id,
                     productId: +productId

                   }
                },
                data: {
                  quantity: findCartItem.quantity+1
                }
              })
            } else {
              await prisma.cartItem.create({
               data: {
                 cartId: cart?.id,
                 productId: Number(productId)
               }
             }) 

            }

          return this.recalcCart(cart.id)
        }

        async deleteFromCart( productId: number, cartToken: string) {
          
          const cart = await prisma.cart.findUnique ({
            where: {
               // userId: Number(userId),
                token: cartToken
            }
          })

          if (!cart) {
            throw new Error ('Корзина не найдена')
          }
    
           await prisma.cartItem.delete({
            where: {
              cartId_productId: {
                cartId: cart?.id,
                productId: Number(productId)
              }
            }
          })
          
           return this.recalcCart(cart?.id)
        }

        async updateCart (productId: number, cartToken: string, quantity: number) {
             const cart = await prisma.cart.findUnique ({
            where: {
                token: cartToken
            }
          })

           if (!cart) {
            throw new Error ('Корзина не найдена')
          }

           await prisma.cartItem.update ({
            where: {
              cartId_productId: {
                cartId: cart?.id,
                productId: Number(productId)
              }
            },
            data: {
                quantity: +quantity
            }
          })

          return this.recalcCart(cart?.id)
        }
  
}

export const cartService = new CartService ()
