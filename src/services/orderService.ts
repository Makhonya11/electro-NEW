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

        async getOrderById (id: number) {

                const order = await prisma.order.findUnique({
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


                return order
        }

        async createOrder (userId: number) {

              const userCart = await prisma.cart.findUnique({
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

              const newOrder = await prisma.order.create({
                data: {
                  userId,
                  //totalAmount: userCart?.totalAmount ,
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

                return order
        }

          async cancelOrder (id: number) {

                const order = await prisma.order.update({
                    where: {
                        id
                    }, 
                    data: {
                      status: "CANCELED"
                    }
                })

                return order
        }

          async updateStatus (id: number, status: OrderStatus ) {

                const order = await prisma.order.update({
                    where: {
                        id
                    }, 
                    data: {
                      status
                    }
                })

                return order
        }

}

export const orderService = new OrderService ()
