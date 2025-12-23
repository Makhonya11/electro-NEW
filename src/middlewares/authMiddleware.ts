import {verify} from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {

    const token = req.cookies.token
if (!token) {
    return res.status(401).json({message: 'Необходима авторизация'})
}

try {
    const payload = verify(token, process.env.JWT_SECRET as string)
    req.user = payload
    next()
} catch (error) {
    console.error('Auth Error', error)
    return res.status(401).json({message: 'Неверный токен авторизации'})
}

}