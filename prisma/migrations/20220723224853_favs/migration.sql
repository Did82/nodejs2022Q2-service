/*
  Warnings:

  - The `favsId` column on the `Album` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `favsId` column on the `Artist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `favsId` column on the `Track` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `favs` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `createdAt` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `updatedAt` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_favsId_fkey";

-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_favsId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_favsId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "favsId",
ADD COLUMN     "favsId" INTEGER;

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "favsId",
ADD COLUMN     "favsId" INTEGER;

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "favsId",
ADD COLUMN     "favsId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" INTEGER NOT NULL,
DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" INTEGER NOT NULL;

-- DropTable
DROP TABLE "favs";

-- CreateTable
CREATE TABLE "Favs" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Favs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_favsId_fkey" FOREIGN KEY ("favsId") REFERENCES "Favs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_favsId_fkey" FOREIGN KEY ("favsId") REFERENCES "Favs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_favsId_fkey" FOREIGN KEY ("favsId") REFERENCES "Favs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
