import { Category } from './../../node_modules/.prisma/client/index.d';
import { Request, Response } from "express";
import { userService } from "../services/userService";
import { productService } from "../services/productService";

export class AuthController {

    static async refreshToken (req: Request, res: Response) {
        try {

            const categories = await productService.getCategories()
            return res.json(categories)

        } catch (error) {
            console.error('getCategories ERROR',error)
        }
    }

   
}
