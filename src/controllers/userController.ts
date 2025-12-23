import { Request, Response } from "express";
import { userService } from "../services/userService";


export class UserController {
    static async registration (req: Request, res: Response) {
        try {
            const {email, password, name, phone } = req.body

            const user = userService.registration({email, password, name, phone})

            res.cookie('sessionToken', user, {
                httpOnly:true,
                sameSite:'lax',
            })

            return res.json()

        } catch (error) {
            console.error('REGISTRATION ERROR',error)
        }
    }

    static async login (req: Request, res: Response) {
        try {
            const {email, password } = req.body

            const token = userService.login({email, password})

            res.cookie('sessionToken', token, {
                httpOnly:true,
                sameSite:'lax',
            })

            return res.json()
        } catch (error) {
            console.error('LOGIN ERROR',error)
        }
    }
    // static async auth (req: Request, res: Response) {
    //     try {
    //         const user = UserService.auth(req)
    //         return res.json(user)
    //     } catch (error) {
    //         console.error('Auth ERROR',error)
    //     }
    // }

}

