import { findFirst } from './../../node_modules/effect/src/Array';
import { product } from './../../node_modules/effect/src/Equivalence';
import { prisma } from "../../prisma/prisma-client";


class ProductService {
    async getCategories () {
        const categories = await prisma.categories.findMany({})
        return categories
    }

    async getCategoryProducts (categoryId: string) {
        const products = await prisma.product.findMany({
            where: {
                categoryid: Number(categoryId)
            }
        })
        return products
    }

    async getProduct (productid: string) {
        const product = await prisma.product.findFirst({
            where: {
                productId: Number(productid)
            }
        })
        return product
    }
}

export const productService = new ProductService()