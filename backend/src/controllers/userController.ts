import { Request, Response } from "express";


export class UserController {
    static async registration (req: Request, res: Response) {
        try {
            const {email, password, name, image, phone } = req.body

            const user = UserService.registration({email, password, name, image, phone})

            return res.json(user)

        } catch (error) {
            console.error(error)
        }
    }
    static async login (req: Request, res: Response) {
        try {
            const {email, password, name, image, phone } = req.body

            const user = userService.login({email, password})

            return res.json(user)

        } catch (error) {
            console.error(error)
        }

    }
    static async auth (req: Request, res: Response) {
        try {
            const {email, password, name, image, phone } = req.body

            const user = userService.registration({email, password, name, image, phone})

            return res.json(user)

        } catch (error) {
            console.error(error)
        }
    }

}