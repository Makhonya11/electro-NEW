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
            const userData = req.body
            const userId = req.user?.id
            const avatar = req.file.filename
            console.log(req.body.image)
            
            const user = await userService.updateProfile(userData, userId, avatar)

            return res.json(user)

        } catch (error) {
            console.error('UPDATEPROFILE ERROR',error)
        }
    }

     static async getProfile (req, res: Response) {
        try {
            const userId = req.user?.id
            
            const user = await userService.getProfile( userId)

            return res.json(user)

        } catch (error) {
            console.error('GETPROFILE ERROR',error)
        }
    }

     static async getOrders (req, res: Response) {
        try {
            const userId = req.user?.id
            
            const orders = await userService.getOrders( userId)

            return res.json(orders)

        } catch (error) {
            console.error('GETPROFILE ERROR',error)
        }
    }

     static async getFavorites (req, res: Response) {
        try {
            const userId = req.user?.id
            
            const orders = await userService.getFavorites(userId)

            return res.json(orders)

        } catch (error) {
            console.error('GETPROFILE ERROR',error)
        }
    }

     static async addFavorite (req, res: Response) {
        try {
            const userId = req.user?.id
            
            const orders = await userService.getFavorites(userId)

            return res.json(orders)

        } catch (error) {
            console.error('GETPROFILE ERROR',error)
        }
    }

}

