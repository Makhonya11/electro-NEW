import { OrderStatus } from "@prisma/client"
import { prisma } from "../../prisma/prisma-client"




class OrderService {

        async getOrders (userId: number) {

                const orders = await prisma.order.findMany({
                    where: {
                        userId
                    },
                    include: {
              items: {
                include: {
                  product:true
                }
              }
            }
                })

                return orders
        }

        async getOrderById (id: number, userId: number) {

                const order = await prisma.order.findUnique({
                    where: {
                        id,
                        userId
                    },
                    include: {
              items: {
                include: {
                  product:true
                }
              }
            }
                })

                if (!order) {
                  throw new Error ("Заказ не найден")
                }

                return order
        }

        async createOrder (userId: number, token: string, orderData) {

              const userCart = await prisma.cart.findUnique({
                where: {
                  token
                },
                include: {
                  items: {
                    include: {
                      product:true
                    }
                  }
                }
              })

              const newOrder = await prisma.order.create({
                data: {
                  userId,
                  totalAmount: userCart?.totalAmount,
                  percipientName: orderData.name,
                  email: orderData.email,
                  phone: orderData.phone
                }
              })

              const orderItems = userCart?.items.map(item => {
                return {
                  orderId: newOrder.id, 
                  productId: item.productId, 
                  priceAtBuy: item.product.price,
                  quantity: item.quantity
                }
              })
              console.log(orderItems)
              
              if (!orderItems) {
                throw new Error ('ошибка создания заказа')
              }
              
               await prisma.orderItem.createMany({
                data: orderItems 
               })

                const order = await prisma.order.findUnique({
                where: {
                  id: newOrder.id
                },
                include: {
                  items: {
                    include: {
                      product:true
                    }
                  }
                }
              })

              await prisma.cartItem.deleteMany({
                where: {
                    id: userCart?.id
                }
              })

                return order
        }

          async cancelOrder (id: number, userId: number) {

                const order = await prisma.order.update({
                    where: {
                        id,
                        userId
                    }, 
                    data: {
                      status: "CANCELED"
                    }
                })

                return order
        }

          async updateStatus (id: number, status: OrderStatus, userId: number ) {

                const order = await prisma.order.update({
                    where: {
                        id,
                        userId
                    }, 
                    data: {
                      status
                    }
                })

                return order
        }

}

export const orderService = new OrderService ()
