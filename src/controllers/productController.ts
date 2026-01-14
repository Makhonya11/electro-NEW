import { Category } from './../../node_modules/.prisma/client/index.d';
import { Request, Response } from "express";
import { userService } from "../services/userService";
import { productService } from "../services/productService";

export class ProductController {

    static async getCategories (req: Request, res: Response) {
        try {

            const categories = await productService.getCategories()
            return res.json(categories)

        } catch (error) {
            console.error('getCategories ERROR',error)
        }
    }

    static async getProductsByCategory (req: Request, res: Response) {
        try {
            const id = req.body.categoryId
            const {categoryName} = req.params
            console.log(categoryName)

            const products = await productService.getProductsByCategory(id)
            return res.json(products)

        } catch (error) {
            console.error('getProductsByCategory ERROR',error)
        }
    }

    static async getProductsByBrand (req: Request, res: Response) {
        try {
            const id = req.body.brandId
            const {brandName} = req.params
            console.log(brandName)

            const products = await productService.getProductsByBrand(id)
            return res.json(products)

        } catch (error) {
            console.error('getProductsByBrand ERROR',error)
        }
    }

    static async getProduct (req: Request, res: Response) {
        try {
            const productId = req.body.productId
            const {productName, categoryName} = req.params

            console.log(productName, categoryName)

            const product = await productService.getProduct(productId)
            return res.json(product)

        } catch (error) {
            console.error('getProduct ERROR',error)
        }
    }
}
