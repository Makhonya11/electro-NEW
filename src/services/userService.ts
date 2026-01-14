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
     async registration (data: CreateUserInput) {
      console.log(data)

        const {email, password} = data

        //console.log(email, password)

        const isExisting = await prisma.user.findUnique({
          where: {
              email
          }
        })

        if (isExisting) {
          throw new Error ('Пользователь с такой почтой уже зарегистрирован')
        }

        const newUser = await prisma.user.create({
          data: {
            ...data,
            password: hashSync(password, 10)
          }
        })

        const sessionToken = jwt.sign({id: newUser.id}, process.env.JWT_SECRET as string, {expiresIn:'7d'})

        return sessionToken

    }

     async logIn (userData: LoginUserInput) {

        const {email, password} = userData
        console.log(email)

        const existingUser = await prisma.user.findUnique({
          where: {
              email
          }
        })

        console.log(existingUser)

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

     async updateProfile (userData: UpdateUserInput, userId: number, image: string) {

      if (userData.password) {
         userData.password = hashSync(userData.password, 10)
      }

        const newUserData = await prisma.user.update({
          where: {
              id: Number(userId)
          },
          data: {
            ...userData, 
            image
          }
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

    async getOrders(userId: string) {
      const orders = await prisma.order.findMany({
        where: {
          userId: Number(userId)
        }
      }) 

      return orders
    }

    async getFavorites(userId: string) {
      const favorites = await prisma.favorite.findMany({
        where: {
          userId: Number(userId)
        },
        include: {
          product:true
        }
      }) 
      return favorites
    }
   
    async toggleFavorite(userId: string, productId: string) {
      const isFavorite = await prisma.favorite.findUnique({
       where: {
        userId_productId: {
        userId: +userId,
        productId: +productId
       }
      }}) 

      if (isFavorite) {
        await prisma.favorite.delete({
          where: {
            id: isFavorite.id
          }
        })
      } else {
          await prisma.favorite.create({
        data: {
          userId: Number(userId),
          productId: Number(productId)
        }
      })
      }
    }
    
}

export const userService = new UserService()