
import { prisma } from "../../prisma/prisma-client";


class AuthService {
    async refreshToken () {

        const categories = await prisma.category.findMany({})
        return categories
    }

    
}

export const authService = new AuthService()