import { compare, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/prisma-client';
import { ApiError } from '../errors/apiError';

interface LoginUserInput {
  email: string;
  password: string;
}
interface CreateUserInput extends LoginUserInput {
  name: string;
  phone?: string;
}

interface UpdateUserInput extends CreateUserInput {
  image: string;
}

class UserService {
  async registration(data: CreateUserInput) {
    const { email, password } = data;

    const isExisting = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isExisting) {
      throw ApiError.conflict('Пользователь с такой почтой уже зарегистрирован');
    }

    let user = await prisma.user.create({
      data: {
        ...data,
        password: hashSync(password, 10),
      },
    });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET!, { expiresIn: '30d' });
    const refreshTokenHash = hashSync(refreshToken, 10);
    const refreshExp = new Date();
    refreshExp.setDate(refreshExp.getDate() + 30);
    const sessionToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '5m' });

    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshTokenHash,
        refreshTokenExp: refreshExp,
      },
    });

    return { sessionToken, user, refreshToken };
  }

  async logIn(userData: LoginUserInput) {
    const { email, password } = userData;

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    console.log(user);

    if (!user) {
      throw ApiError.badRequest('Неверный логин или пароль');
    }
    const isMatchPassword = await compare(password, user.password);

    if (!isMatchPassword) {
      throw ApiError.badRequest('Неверный логин или пароль');
    }

    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET as string, { expiresIn: '30d' });
    const refreshTokenHash = hashSync(refreshToken, 10);
    const refreshExp = new Date();
    refreshExp.setDate(refreshExp.getDate() + 30);
    const sessionToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '5m' });

    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshTokenHash,
        refreshTokenExp: refreshExp,
      },
    });
    return { sessionToken, user, refreshToken };
  }

  async logOut(userId: number) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenHash: null,
        refreshTokenExp: null,
      },
    });
  }

  async updateProfile(userData: UpdateUserInput, userId: number, image: string | undefined) {
    if (userData.password) {
      userData.password = hashSync(userData.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        ...userData,
        image,
      },
    });

    if (!updatedUser) {
      throw ApiError.notFound('Пользователь не найден');
    }
    return updatedUser;
  }

  async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw ApiError.unauthorized();
    }
    return user;
  }

  async getFavorites(userId: number) {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        product: true,
      },
    });
    return favorites;
  }

  async toggleFavorite(userId: number, productId: string) {
    const isFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: +productId,
        },
      },
    });

    if (isFavorite) {
      await prisma.favorite.delete({
        where: {
          id: isFavorite.id,
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId: userId,
          productId: +productId,
        },
      });
    }
  }
}

export const userService = new UserService();
