import { verify } from 'jsonwebtoken';
import { authService } from './../services/authService';
import { Request, Response } from "express";


export class AuthController {

    static async refreshToken (req: Request, res: Response) {
      
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json({message: "Необходима авторизация"})
        }
        try {

            const userData = verify(refreshToken, process.env.REFRESH_SECRET as string)
            const userId = +userData?.id
            const accessToken = await authService.refreshToken(userId, refreshToken)

            if (accessToken) {
                res.cookie('sessionToken', accessToken, {
                httpOnly:true,
                sameSite:'strict',
                secure: true
            })
            }
            return res.status(200).json({message: 'Access token обновлён'})

        } catch (error) {
            console.error('getCategories ERROR',error)
        }
    }

   
}
