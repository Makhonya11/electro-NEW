import { Request, Response } from "express";
import { prisma } from "../../prisma/prisma-client";
import { orderService } from "../services/orderService";

interface RequestWithAuth extends Request {
    user: {
        id: number
    }
}

export class OrderController {
    static async getOrders (req:RequestWithAuth, res: Response) {
         const userId = req.user.id
         const orders = await orderService.getOrders( userId)

        return res.json(orders)
  }

      static async getOrderById (req:RequestWithAuth, res: Response) {

            const userId = req.user?.id
            const id = +req.params.id
            const order = await orderService.getOrderById(id, userId)

            res.json(order)

    }

      static async create (req:RequestWithAuth, res: Response) {
           
           const userId = +req.user?.id
           const token = req.cookies.cartToken
           const orderData = req.body
           const newOrder = await orderService.createOrder(userId, token, orderData)
           return res.json(newOrder)


    }

      static async cancel (req:RequestWithAuth, res: Response) {

            const userId = +req.user?.id
            const orderId = +req.params.id
            const order = await orderService.cancelOrder( orderId, userId)

            res.json(order)


    }

      static async updateStatus (req:RequestWithAuth, res: Response) {

            const userId = req.user?.id
            const orderId = +req.params.id
            const status = req.body.status
            console.log(status)

            const order = await orderService.updateStatus( orderId, status, userId)

            return res.status(200).json(order)
    }
}

 
