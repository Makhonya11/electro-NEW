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

            //const userId = req.user?.id
            const orderId = +req.params

            const order = await orderService.getOrderById(orderId)

            res.json(order)

        } catch (error) {
            console.error('getOrderById ERROR',error)
        }
    }

      static async create (req:Request, res: Response) {
        try {
           
           const userId = +req.user?.id
           const newOrder = await orderService.createOrder(userId)
           return res.json(newOrder)

        } catch (error) {
            console.error('createOrder ERROR',error)
        }
    }

      static async cancel (req:Request, res: Response) {
        try {

            const orderId = +req.params
            const order = await orderService.getOrderById( orderId)

            res.json(order)

        } catch (error) {
            console.error('getOrderById ERROR',error)
        }
    }

      static async updateStatus (req:Request, res: Response) {
        try {

            const userId = req.user?.id
            const orderId = +req.params
            const status = req.body

            const order = await orderService.updateStatus( orderId, status)

            res.json(order)

        } catch (error) {
            console.error('getOrderById ERROR',error)
        }
    }
}

 
