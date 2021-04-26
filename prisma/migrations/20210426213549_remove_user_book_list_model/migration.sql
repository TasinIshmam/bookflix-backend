/*
  Warnings:

  - You are about to drop the `UserBookList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserBookList" DROP CONSTRAINT "UserBookList_bookId_fkey";

-- DropForeignKey
ALTER TABLE "UserBookList" DROP CONSTRAINT "UserBookList_userId_fkey";

-- AlterTable
ALTER TABLE "ReadingHistory" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOnMyList" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "UserBookList";

-- DropEnum
DROP TYPE "UserBookListType";
