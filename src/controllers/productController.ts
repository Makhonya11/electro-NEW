import { Category } from './../../node_modules/.prisma/client/index.d';
import { Request, Response } from "express";
import { userService } from "../services/userService";
import { productService } from "../services/productService";

export class ProductController {
    static async getCategories (req: Request, res: Response) {
        try {

            const categories = productService.getCategories()
            return res.json(categories)

        } catch (error) {
            console.error('CATALOG ERROR',error)
        }
    }
    static async getCategoryProducts (req: Request, res: Response) {
        try {
            const id = req.query.categoryId

            const categories = productService.getCategories()
            return res.json(categories)

        } catch (error) {
            console.error('CATALOG ERROR',error)
        }
    }
    static async getBrandProducts (req: Request, res: Response) {
        try {
            const userData = req.body

            const categories = productService.getCategories()
            return res.json(categories)

        } catch (error) {
            console.error('CATALOG ERROR',error)
        }
    }
    static async getProduct (req: Request, res: Response) {
        try {
            const userData = req.body

            const categories = productService.getCategories()
            return res.json(categories)

        } catch (error) {
            console.error('CATALOG ERROR',error)
        }
    }
}
