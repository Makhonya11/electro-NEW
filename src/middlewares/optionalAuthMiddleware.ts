import { NextFunction } from 'express'
import {verify} from 'jsonwebtoken'

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }, // ключ — имя куки
  user?: {}
}

export const optionalAuthMiddleware = (req: RequestWithCookies, res:Response, next:NextFunction) => {

    const token = req.cookies.sessionToken
if (!token) {
   return next()
}

try {
    const payload = verify(token, process.env.JWT_SECRET as string)
    req.user = payload
} catch (error) {
    console.error('Auth Error', error)
}

next()
}