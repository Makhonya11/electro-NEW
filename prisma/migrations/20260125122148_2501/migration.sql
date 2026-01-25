/*
  Warnings:

  - You are about to drop the `ProductInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductInfo" DROP CONSTRAINT "ProductInfo_productId_fkey";

-- DropTable
DROP TABLE "public"."ProductInfo";

-- CreateTable
CREATE TABLE "ProductCharacteristic" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductCharacteristic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductCharacteristic" ADD CONSTRAINT "ProductCharacteristic_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
