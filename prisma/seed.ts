import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function up() {
  console.log('🌱 Seeding database...')

  // --------------------
  // USERS
  // --------------------
  const user = await prisma.user.create({
    data: {
      email: 'user@test.com',
      password: 'hashed_password',
      name: 'Test User',
      phone: '+79990001122'
    }
  })

  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: 'hashed_admin_password',
      name: 'Admin',
      role: 'ADMIN'
    }
  })

  // --------------------
  // CART
  // --------------------
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
      token: 'cart-token-123'
    }
  })

  // --------------------
  // BRANDS & CATEGORIES
  // --------------------
  const apple = await prisma.brand.create({
    data: { name: 'Apple' }
  })

  const samsung = await prisma.brand.create({
    data: { name: 'Samsung' }
  })

  const smartphones = await prisma.category.create({
    data: { name: 'Smartphones' }
  })

  const laptops = await prisma.category.create({
    data: { name: 'Laptops' }
  })

  await prisma.typeBrand.createMany({
    data: [
      { brandId: apple.id, categoryId: smartphones.id },
      { brandId: apple.id, categoryId: laptops.id },
      { brandId: samsung.id, categoryId: smartphones.id }
    ]
  })

  // --------------------
  // PRODUCTS
  // --------------------
  const iphone = await prisma.product.create({
    data: {
      name: 'iPhone 15',
      price: 99900,
      rating: 5,
      brandId: apple.id,
      categoryId: smartphones.id,
      info: {
        create: {
          title: 'iPhone 15',
          description: 'Latest Apple smartphone'
        }
      },
      images: {
        create: [
          { url: '/iphone-main.jpg', isMain: true },
          { url: '/iphone-2.jpg' }
        ]
      }
    }
  })

  const galaxy = await prisma.product.create({
    data: {
      name: 'Samsung Galaxy S24',
      price: 89900,
      rating: 4,
      brandId: samsung.id,
      categoryId: smartphones.id
    }
  })

  // --------------------
  // CART ITEMS
  // --------------------
  await prisma.cartItem.createMany({
    data: [
      {
        cartId: cart.id,
        productId: iphone.id,
        quantity: 1
      },
      {
        cartId: cart.id,
        productId: galaxy.id,
        quantity: 2
      }
    ]
  })

  // --------------------
  // FAVORITES
  // --------------------
  await prisma.favorite.create({
    data: {
      userId: user.id,
      productId: iphone.id
    }
  })

  // --------------------
  // REVIEW
  // --------------------
  await prisma.review.create({
    data: {
      userId: user.id,
      productId: iphone.id,
      rate: 5,
      review: 'Отличный телефон, всё летает!'
    }
  })

  // --------------------
  // ADDRESS
  // --------------------
  const address = await prisma.userAddress.create({
    data: {
      userId: user.id,
      fullAddress: 'Москва, ул. Пушкина, д. 10',
      data: {
        city: 'Москва',
        street: 'Пушкина',
        house: '10'
      },
      latitude: 55.7558,
      longitude: 37.6173,
      isDefault: true
    }
  })

  // --------------------
  // ORDER
  // --------------------
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'PAID',
      totalAmount: 279700,
      deliveryPrice: 500,
      paymentType: 'CARD',
      deliveryAddress: {
        address: address.fullAddress
      },
      userAddressId: address.id,
      items: {
        create: [
          {
            productId: iphone.id,
            priceAtBuy: iphone.price,
            quantity: 1
          },
          {
            productId: galaxy.id,
            priceAtBuy: galaxy.price,
            quantity: 2
          }
        ]
      }
    }
  })

  // --------------------
  // PAYMENT
  // --------------------
  await prisma.payment.create({
    data: {
      userId: user.id,
      orderId: order.id,
      provider: 'YOOKASSA',
      providerPaymentId: 'pay_123456',
      status: 'SUCCEEDED',
      amount: order.totalAmount,
      currency: 'RUB',
      confirmationUrl: 'https://pay.confirm',
      receiptJson: {
        receipt: true
      }
    }
  })

  console.log('✅ Seeding finished')
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
