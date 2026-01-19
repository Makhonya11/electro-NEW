import { Request, Response } from "express";
import { userService } from "../services/userService";

export class UserController {
    static async registration (req: Request, res: Response) {
        try {
            const {data} = req.body
            console.log(data)

            const {user, sessionToken} = await userService.registration(data)

            res.cookie('sessionToken', sessionToken, {
                httpOnly:true,
                sameSite:'lax',
            })

            return res.json(user)

        } catch (error) {
            console.error('REGISTRATION ERROR',error)
            return res.status(500).json({message: error})
        }
    }

    static async logIn (req: Request, res: Response) {
        try {
            const {email, password } = req.body.data

              const {sessionToken, user} = await userService.logIn({email, password})

            res.cookie('sessionToken', sessionToken, {
                httpOnly:true,
                sameSite:'lax',
            })

            return res.json(user)
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
            const image = req.file.filename
            console.log(req.file)
            
            const user = await userService.updateProfile(userData, userId, image)

            return res.json(user)

        } catch (error) {
            console.error('UPDATEPROFILE ERROR',error)
        }
    }

     static async getProfile (req: Request, res: Response) {
        try {
            const userId = req.user?.id
            const user = await userService.getProfile( userId)

            return res.json(user)

        } catch (error) {
            console.error('GETPROFILE ERROR',error)
        }
    }

     static async getOrders (req: Request, res: Response) {
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
            const favorites = await userService.getFavorites(userId)

            return res.json(favorites)

        } catch (error) {
            console.error('getFavorites ERROR',error)
        }
    }

     static async addToFavorites (req, res: Response) {
        try {
            const userId = req.user?.id
            const productId = req.body.productId
            console.log(productId)
            
            await userService.toggleFavorite(userId, productId)

            return res.json()


        } catch (error) {
            console.error('toggleFavorite ERROR',error)
        }
    }
     static async deleteFromFavorites (req, res: Response) {
        try {
            const userId = req.user?.id
            const productId = req.body.productId
            
            await userService.toggleFavorite(userId, productId)

            return res.json()

        } catch (error) {
            console.error('toggleFavorite ERROR',error)
        }
    }
   



}

