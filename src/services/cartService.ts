import { Cart, CartItem } from '@prisma/client';
import { Product } from './../../node_modules/.prisma/client/index.d';
import { hashSync } from "bcrypt"
import { prisma } from "../../prisma/prisma-client"
import { tr } from "zod/locales"
import { calcCartTotal } from '../utils/calcCartTotal';


class CartService {

 private async recalcCart(id: number) {
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

      private async getOrCreateUserCart ( userId: number) {

             let userCart = await prisma.cart.findUnique({
                    where: {
                        userId: userId
                    }
                })

                if (!userCart) {
                  userCart = await prisma.cart.create({
                    data: {
                      userId
                    }
                  })
                }

                return userCart
          } 
        
          
        private  async getOrCreateGuestCart(cartToken: string) {

            let guestCart = await prisma.cart.findUnique({
                    where: {
                        token: cartToken
                    }
                })

                if (!guestCart) {
                  guestCart = await prisma.cart.create({
                    data: {
                      token: cartToken
                    }
                  })
                }

                return guestCart
          }
            
            private async mergeCarts(guestCart: Cart, userCart: Cart) {

              if (guestCart.items?.length === 0) return

               for (const item of guestCart.items) {
                  const existingItem = await prisma.cartItem.findUnique({
                    where:{
                      cartId_productId: {
                        cartId: userCart.id,
                        productId: item.productId
                      }
                    }
                  })

                  if (existingItem) {
                    await prisma.cartItem.update({
                      where: {
                        id: existingItem.cartId
                      },
                      data: {
                        quantity: existingItem.quantity + item.quantity
                      }
                    })
                  } else {
                    await prisma.cartItem.create({
                      data: {
                        cartId: userCart.id,
                        productId: item.productId,
                        quantity: item.quantity
                      }
                    })
                  }
               }

               await prisma.cart.delete({
                where: {
                  id: guestCart.id
                }
               })

             
            }

            async getCart (cartToken: string | undefined, userId: number | undefined) {
              
              let guestCart
              let userCart
              if(cartToken) {
               guestCart =  await this.getOrCreateGuestCart(cartToken)
              }
              if (userId) {
                userCart = await this.getOrCreateUserCart(userId)
              }

              if (guestCart && userCart) {
                await this.mergeCarts(guestCart, userCart)
                return this.recalcCart(userCart.id)
              }

              if( guestCart) return this.recalcCart(guestCart.id)
              if( userCart) return this.recalcCart(userCart.id)
              
              throw new Error('Корзина не найдена')
            }


        async addToCart( productId: number, cartToken: string, userId: number) {
          let cart

          if (userId) {
             cart = await this.getOrCreateUserCart(userId)
          } else {
            cart = await this.getOrCreateGuestCart(cartToken)
          }
            
            const findCartItem = await prisma.cartItem.findUnique({
              where: {
                cartId_productId: {
                  cartId: cart.id,
                  productId: productId
                }
              }
            })

            if (findCartItem) {
              await prisma.cartItem.update({
                where: {
                   cartId_productId: {
                     cartId: cart.id,
                     productId: productId

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
                 productId: productId
               }
             }) 
            }

          return this.recalcCart(cart.id)
        }

        async deleteFromCart( productId: number, cartToken: string, userId: number) {
          
          let cart 
          if(userId) {
            cart = await prisma.cart.findUnique ({
             where: { userId}
           })
          } else {
            cart = await prisma.cart.findUnique ({
             where: { 
              token: cartToken
             }
           })
          }

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

        async updateCart (productId: number, cartToken: string, quantity: number, userId: number) {
            
          let cart 
          if(userId) {
            cart = await prisma.cart.findUnique ({
             where: { userId}
           })
          } else {
            cart = await prisma.cart.findUnique ({
             where: { 
              token: cartToken
             }
           })
          }

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
