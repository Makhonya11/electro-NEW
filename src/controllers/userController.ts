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

    static async logIn (req: Request, res: Response) {
        try {
            const {email, password } = req.body

              const {sessionToken, existingUser} = await userService.logIn({email, password})

            res.cookie('sessionToken', sessionToken, {
                httpOnly:true,
                sameSite:'lax',
            })

            return res.json(existingUser)
        } catch (error) {
            console.error('LOGIN ERROR',error)
        }
    }
    static async logOut (req: Request, res: Response) {
        try {
            const token = req.cookies.sessionToken

                res.clearCookie('sessionToken', {
                    httpOnly:true,
                    sameSite:'lax',
                    path: '/'
                })

            return res.status(200).json({ message: 'Logged out' })
        } catch (error) {
            console.error('LOGOUT ERROR',error)
            return res.status(500).json({ message: 'Logout failed' })
        }
    }

     static async updateProfile (req, res: Response) {
        try {
            const useData = req.body
            const userId = req.user?.id
            

            const user = userService.updateProfile(useData, userId)


            return res.json(user)

        } catch (error) {
            console.error('REGISTRATION ERROR',error)
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

