import { PrismaClient, UserRole, OrderStatus, PaymentProvider, PaymentStatus } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();


async function up() {
  console.log('🌱 Seeding database...');

  // --------------------
  // CATEGORIES
  // --------------------
  const smartphones = await prisma.category.create({
    data: { name: 'Смартфоны' },
  });

  const laptops = await prisma.category.create({

    data: { name: 'Ноутбуки' },
  });

  // --------------------
  // BRANDS
  // --------------------
  const apple = await prisma.brand.create({

    data: { name: 'Apple' },
  });

  const samsung = await prisma.brand.create({

    data: { name: 'Samsung' },
  });

  const asus = await prisma.brand.create({
    data: { name: 'Asus' },
  });

  // --------------------
  // BRAND ↔ CATEGORY
  // --------------------
  await prisma.typeBrand.createMany({
    data: [
      { brandId: apple.id, categoryId: smartphones.id },
      { brandId: samsung.id, categoryId: smartphones.id },
      { brandId: apple.id, categoryId: laptops.id },
      { brandId: asus.id, categoryId: laptops.id },
    ],
    skipDuplicates: true,
  });

  // --------------------
  // PRODUCTS
  // --------------------
  const iphone = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro',
      price: 120000,
      rating: 5,
      availability: 10,
      brandId: apple.id,
      categoryId: smartphones.id,
      characteristics: {
        create: [
          { title: 'Экран', description: '6.1 OLED' },
          { title: 'Память', description: '256 GB' },
          { title: 'Процессор', description: 'A17 Pro' },
        ],
      },
      images: {
        create: [
          { url: '/images/iphone15-main.jpg', isMain: true },
          { url: '/images/iphone15-2.jpg' },
        ],
      },
    },
  });

  const galaxy = await prisma.product.create({
    data: {
      name: 'Samsung Galaxy S24',
      price: 95000,
      rating: 4,
      availability: 7,
      brandId: samsung.id,
      categoryId: smartphones.id,
      characteristics: {
        create: [
          { title: 'Экран', description: '6.2 AMOLED' },
          { title: 'Память', description: '256 GB' },
          { title: 'Процессор', description: 'Exynos 2400' },
        ],
      },
      images: {
        create: [
          { url: '/images/galaxy-s24-main.jpg', isMain: true },
        ],
      },
    },
  });

  const macbook = await prisma.product.create({
    data: {
      name: 'MacBook Pro M3',
      price: 210000,
      rating: 5,
      availability: 5,
      brandId: apple.id,
      categoryId: laptops.id,
      characteristics: {
        create: [
          { title: 'Процессор', description: 'Apple M3' },
          { title: 'Память', description: '16 GB RAM' },
          { title: 'Экран', description: '14 Retina' },
        ],
      },
      images: {
        create: [
          { url: '/images/macbook-m3-main.jpg', isMain: true },
        ],
      },
    },
  });

  const asusLaptop = await prisma.product.create({
    data: {
      name: 'Asus ZenBook 14',
      price: 135000,
      rating: 4,
      availability: 8,
      brandId: asus.id,
      categoryId: laptops.id,
      characteristics: {
        create: [
          { title: 'Процессор', description: 'Intel Core i7' },
          { title: 'Память', description: '16 GB RAM' },
          { title: 'Вес', description: '1.3 кг' },
        ],
      },
      images: {
        create: [
          { url: '/images/zenbook-main.jpg', isMain: true },
        ],
      },
    },
  });

  console.log('✅ Seeding finished successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


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
    await down();
    await up();
  } catch (error) {
    console.log(error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
