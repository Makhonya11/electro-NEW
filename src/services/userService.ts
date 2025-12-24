import {compare, hash, hashSync} from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../../prisma/prisma-client'






interface LoginUserInput {
  email:     string   
  password:  string
}
interface CreateUserInput extends LoginUserInput {
  name:      string  
  phone?:    string
}

interface UpdateUserInput extends CreateUserInput {
  image: string
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

     async logIn (userData: LoginUserInput) {

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

        return {sessionToken, existingUser}

    }

     async updateProfile (userData: UpdateUserInput, userId: number) {



        const newUserData = await prisma.user.update({
          where: {
              id: Number(userId)
          },
          data: {
            email: userData.email,
            name: userData.name,
            image: userData.image,
            phone: userData.phone,
            password: hashSync(userData.password, 10)
          }
        })

        return newUserData

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