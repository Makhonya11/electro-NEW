import { findFirst } from './../../node_modules/effect/src/Array';
import { product } from './../../node_modules/effect/src/Equivalence';
import { prisma } from "../../prisma/prisma-client";


class ProductService {
    async getCategories () {
        const categories = await prisma.category.findMany({})
        return categories
    }

    async getProductsByCategory (categoryId: string) {
        const products = await prisma.product.findMany({
            where: {
                categoryId: +categoryId
            }
        })
        return products
    }

    async getProductsByBrand (brandId: string) {
        const products = await prisma.product.findMany({
            where: {
                brandId: Number(brandId)
            }
        })
        return products
    }

    async getProduct (productid: string) {
        const product = await prisma.product.findUnique({
            where: {
                id: Number(productid)
            }
        })
        return product
    }
}

export const productService = new ProductService()