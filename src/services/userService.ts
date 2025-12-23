import {compare, hash, hashSync} from 'bcrypt'
import jwt from 'jsonwebtoken'

import { prisma } from "../../prisma/prisma-client"




interface LoginUserInput {
  email:     string   
  password:  string
}
interface CreateUserInput extends LoginUserInput {
  name:      string  
  phone?:    string
}

 class UserService {
     async registration (userData: CreateUserInput) {

        const {email, password, name, phone} = userData

        const isExisting = await prisma.user.findFirst({
          where: {
              email
          }
        })

        if (isExisting) {
          throw new Error ('Пользователь с такой почтой уже зарегистрирован')
        }

        const newUser = await prisma.user.create({
          data: {
            email,
            name,
            password: hashSync(password, 10)
          }
        })

        const sessionToken = jwt.sign({id: newUser.id}, process.env.JWT_SECRET as string, {expiresIn:'7d'})

        return sessionToken

    }

     async login (userData: LoginUserInput) {

        const {email, password} = userData

        const existingUser = await prisma.user.findFirst({
          where: {
              email
          }
        })

        if (!existingUser) {
          throw new Error ('Пользователя с такой почтой не существует')
        }

        const isMatchPassword = await compare(password, existingUser.password)

        if (!isMatchPassword) {
          throw new Error ('Указан неверный логин или пароль')
        }

        const sessionToken = jwt.sign({id: existingUser.id}, process.env.JWT_SECRET as string, {expiresIn:'7d'})

        return sessionToken

    }

    //  static async auth (req) {

    //     const sessionToken  = req.cookies.get('sessionToken')

    //   if (!sessionToken) {
    //     throw new Error ('Необходимо пройти авторизацию')
    //   }

    //   return sessionToken
    // }
}

export const userService = new UserService()