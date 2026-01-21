import { Category } from './../../node_modules/.prisma/client/index.d';
import { Request, Response } from "express";
import { userService } from "../services/userService";
import { productService } from "../services/productService";

export class ProductController {

    static async getCategories (req: Request, res: Response) {

            const categories = await productService.getCategories()
            return res.json(categories)

    }

    static async getProductsByCategory (req: Request, res: Response) {
            const id = req.body.categoryId
            const {categoryName} = req.params
            console.log(categoryName)

            const products = await productService.getProductsByCategory(id)
            return res.json(products)

    }

    static async getProductsByBrand (req: Request, res: Response) {
            const id = req.body.brandId
            const {brandName} = req.params
            console.log(brandName)

            const products = await productService.getProductsByBrand(id)
            return res.json(products)


    }

    static async getProduct (req: Request, res: Response) {
            const productId = req.body.productId
            const {productName, categoryName} = req.params

            console.log(productName, categoryName)

            const product = await productService.getProduct(productId)
            return res.json(product)

    }
}
