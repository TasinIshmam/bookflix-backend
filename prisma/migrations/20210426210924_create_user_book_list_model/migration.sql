/*
  Warnings:

  - You are about to drop the column `isFavorite` on the `ReadingHistory` table. All the data in the column will be lost.
  - Made the column `bookId` on table `ReadingHistory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `ReadingHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserBookListType" AS ENUM ('FAVORITE', 'MY_LIST');

-- AlterTable
ALTER TABLE "ReadingHistory" DROP COLUMN "isFavorite",
ALTER COLUMN "bookId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "UserBookList" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "listName" "FavoriteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBookList.bookId_userId_unique" ON "UserBookList"("bookId", "userId");

-- AddForeignKey
ALTER TABLE "UserBookList" ADD FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookList" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
