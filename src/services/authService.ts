
import { v4 as uuid } from "uuid";
import { prisma } from "../../prisma/prisma-client";
import { compare, compareSync, hashSync } from "bcrypt";
import jwt from 'jsonwebtoken'

class AuthService {
    async refreshToken (id: number, refreshToken: string) {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })
        if (!user) {
            throw new Error ("Необходима авторизация")
        }

        const isValidRefresh = compareSync(refreshToken, user?.refreshTokenHash!)
        if (!isValidRefresh || user.refreshTokenExp! < new Date()) {
            throw new Error ("Необходима авторизация")
        }

        const newAccessToken = jwt.sign({id: user.id}, process.env.JWT_SECRET as string, {expiresIn:'5m'})
        const newRefreshHash = hashSync(refreshToken, 10)
        await prisma.user.update({
            where: {
                id: user.id
            }, 
            data: {
                refreshTokenHash: newRefreshHash
            }
        })
        return newAccessToken
    }
}

export const authService = new AuthService()