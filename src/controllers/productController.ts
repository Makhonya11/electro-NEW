import { Request, Response } from "express";
import { userService } from "../services/userService";
import multer from 'multer'


export class UserController {
    static async registration (req: Request, res: Response) {
        try {
            const userData = req.body

            const user = userService.registration(userData)

            res.cookie('sessionToken', user, {
                httpOnly:true,
                sameSite:'lax',
            })

            return res.json()

        } catch (error) {
            console.error('REGISTRATION ERROR',error)
        }
    }
}
