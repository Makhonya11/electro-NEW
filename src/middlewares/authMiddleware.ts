import { NextFunction } from 'express'
import {verify} from 'jsonwebtoken'
import { ApiError } from '../errors/apiError'

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }, // ключ — имя куки
  user?: {}
}


export const authMiddleware = (req:RequestWithCookies, res:Response, next:NextFunction) => {

    const token = req.cookies?.sessionToken
if (!token) {
    throw ApiError.unauthorized()
}

try {
    const payload = verify(token, process.env.JWT_SECRET as string)
    req.user = payload
    next()
} catch (error) {
    console.error('Auth Error', error)
     throw ApiError.unauthorized()
}

}