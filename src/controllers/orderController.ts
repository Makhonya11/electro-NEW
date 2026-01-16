import { Request, Response } from "express";
import { prisma } from "../../prisma/prisma-client";
import { orderService } from "../services/orderService";


export class OrderController {
    static async getOrders (req:Request, res: Response) {
      try {
         const userId = req.user?.id
         const orders = await orderService.getOrders( userId)

          return res.json(orders)

      } catch (error) {
          console.error('getOrders ERROR',error)
      }
  }

      static async getOrderById (req:Request, res: Response) {
        try {

            const userId = req.user?.id
            const id = +req.params.id

            const order = await orderService.getOrderById(id, userId)

            res.json(order)

        } catch (error:any) {
            //if (error.code === 'P2025') {
                return res.status(404).json({ message: error.message })
             //}
            console.error('getOrderById ERROR',error)
        }
    }

      static async create (req:Request, res: Response) {
        try {
           
           const userId = +req.user?.id
           const token = req.cookies.cartToken
           const orderData = req.body
           const newOrder = await orderService.createOrder(userId, token, orderData)
           return res.json(newOrder)

        } catch (error) {
            console.error('createOrder ERROR',error)
        }
    }

      static async cancel (req:Request, res: Response) {
        try {

            const userId = +req.user?.id
            const orderId = +req.params.id
            const order = await orderService.cancelOrder( orderId, userId)

            res.json(order)

        } catch (error:any) {
             if (error.code === 'P2025') {
    return res.status(404).json({ message: 'Заказ не найден' })
  }
            console.error('getOrderById ERROR',error)
        }
    }

      static async updateStatus (req:Request, res: Response) {
        try {

            const userId = req.user?.id
            const orderId = +req.params.id
            const status = req.body.status
            console.log(status)

            const order = await orderService.updateStatus( orderId, status)

            res.json(order)

        } catch (error:any) {
             if (error.code === 'P2025') {
                return res.status(404).json({ message: 'Заказ не найден' })
             }
            console.error('getOrderById ERROR',error)
        }
    }
}

 
