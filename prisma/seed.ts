import { PrismaClient, UserRole, OrderStatus, PaymentProvider, PaymentStatus } from '@prisma/client'
import { hashSync } from 'bcrypt'

const prisma = new PrismaClient()

async function up() {
  // ======================
  // USERS
  // ======================
  const user = await prisma.user.create({
    data: {
      email: 'user@test.com',
      password: hashSync('123456', 10),
      name: 'Test User',
      phone: '+79990000000',
      role: UserRole.USER,
    },
  })

  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: hashSync('admin123', 10),
      name: 'Admin',
      role: UserRole.ADMIN,
    },
  })

  // ======================
  // BRAND / CATEGORY
  // ======================
  const brand = await prisma.brand.create({
    data: { name: 'Apple' },
  })

  const category = await prisma.category.create({
    data: { name: 'Smartphones' },
  })

  await prisma.typeBrand.create({
    data: {
      brandId: brand.id,
      categoryId: category.id,
    },
  })

  // ======================
  // PRODUCT
  // ======================
  const product = await prisma.product.create({
    data: {
      name: 'iPhone 15',
      price: 120000,
      rating: 5,
      availability: 10,
      brandId: brand.id,
      categoryId: category.id,
      info: {
        create: {
          title: 'iPhone 15',
          description: 'New generation smartphone',
        },
      },
      images: {
        createMany: {
          data: [
            { url: '/uploads/iphone-main.jpg', isMain: true },
            { url: '/uploads/iphone-2.jpg' },
          ],
        },
      },
    },
  })

  // ======================
  // CART
  // ======================
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
      items: {
        create: {
          productId: product.id,
          quantity: 2,
        },
      },
    },
  })

  // ======================
  // FAVORITE
  // ======================
  await prisma.favorite.create({
    data: {
      userId: user.id,
      productId: product.id,
    },
  })

  // ======================
  // ADDRESS
  // ======================
  const address = await prisma.userAddress.create({
    data: {
      userId: user.id,
      fullAddress: 'Moscow, Red Square 1',
      data: { entrance: 1, floor: 3 },
      latitude: 55.7539,
      longitude: 37.6208,
      isDefault: true,
    },
  })

  // ======================
  // ORDER
  // ======================
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: OrderStatus.PAID,
      totalAmount: 240000,
      deliveryPrice: 500,
      paymentType: 'card',
      deliveryAddress: address.fullAddress,
      percipientName: user.name,
      email: user.email,
      phone: user.phone!,
      userAddressId: address.id,
      items: {
        create: {
          productId: product.id,
          priceAtBuy: product.price,
          quantity: 2,
        },
      },
    },
  })

  // ======================
  // PAYMENT
  // ======================
  await prisma.payment.create({
    data: {
      userId: user.id,
      orderId: order.id,
      provider: PaymentProvider.STRIPE,
      providerPaymentId: 'pi_test_123',
      status: PaymentStatus.SUCCEEDED,
      amount: order.totalAmount,
      currency: 'RUB',
      confirmationUrl: 'https://stripe.com/pay',
      receiptJson: { receipt: true },
    },
  })

  console.log('✅ Seed completed')
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Brand" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Favorite" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Order" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Payment" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Review" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "UserAddress" RESTART IDENTITY CASCADE`;
}

async function main() {
    try {
        await down()
        await up()
    } catch (error) {
        console.log (error)
    }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
