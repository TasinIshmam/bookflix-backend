/*
  Warnings:

  - You are about to drop the column `epubLink` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileUrl]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverImageUrl` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Book.epubLink_unique";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "epubLink",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "fileType" TEXT NOT NULL,
ADD COLUMN     "coverImageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Book.fileUrl_unique" ON "Book"("fileUrl");
