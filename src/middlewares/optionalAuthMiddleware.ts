import {verify} from 'jsonwebtoken'

export const optionalAuthMiddleware = (req: Request, res, next) => {

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