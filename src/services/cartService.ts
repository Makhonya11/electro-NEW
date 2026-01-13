import { Product } from './../../node_modules/.prisma/client/index.d';
import { hashSync } from "bcrypt"
import { prisma } from "../../prisma/prisma-client"
import { tr } from "zod/locales"


class CartService {

  async calcTotalAmount(id: number) {
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

          const totalAmount = cart?.items.reduce((acc, item) => {
            return (item.product.price *item.quantity) + acc
          }, 0)

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

                return this.calcTotalAmount(cart.id)
        }

    // ДОРАБОТАТЬ ЭТОТ МЕТОД ПРОВЕРИ СУЩНОСТЬ В ПРИЗМЕ
        async addToCart( productId: string, cartToken: string) {
          
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
            
            const cartItem = await prisma.cartItem.findUnique({
              where: {
                cartId_productId: {
                  cartId: cart.id,
                  productId: +productId
                }
              }
            })



            if (cartItem) {
              await prisma.cartItem.update({
                where: {
                   cartId_productId: {
                     cartId: cart.id,
                     productId: +productId

                   }
                },
                data: {
                  quantity: cartItem.quantity+1
                }
              })
            } else {
              await prisma.cartItem.create({
               data: {
                 cartId: cart?.id as number,
                 productId: Number(productId)
               }
             }) 

            }

          return this.calcTotalAmount(cart.id)
        }

        async deleteFromCart( productId: string, cartToken: string) {
          
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
                cartId: cart?.id as number,
                productId: Number(productId)
              }
            }
          })
          
           return this.calcTotalAmount(cart?.id as number)
        }

        async updateCart (productId: string, cartToken: string, quantity: string) {
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
                cartId: cart?.id as number,
                productId: Number(productId)
              }
            },
            data: {
                quantity: +quantity
            }
          })

          return this.calcTotalAmount(cart?.id as number)
        }

       


    
}

export const cartService = new CartService ()
