import {compare, hash, hashSync} from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../../prisma/prisma-client'
import path from 'path'
import {v4 as uuid} from 'uuid'






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

        const {email, password} = userData

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
            ...userData,
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

     async updateProfile (userData: UpdateUserInput, userId: number, avatar: string) {

      if (userData.password) {
         userData.password = hashSync(userData.password, 10)
      }

        const newUserData = await prisma.user.update({
          where: {
              id: Number(userId)
          },
          data: userData
        })
        return newUserData
    }

    async getProfile(userId: string) {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(userId)
        }
      }) 

      if (!user) {
        throw new Error ('Необходима авторизация')
      }

      return user
    }
   
  
}

export const userService = new UserService()