/*
  Warnings:

  - A unique constraint covering the columns `[isbn10]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[isbn13]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isbn10" TEXT,
ADD COLUMN     "isbn13" TEXT,
ADD COLUMN     "maturityRating" TEXT,
ADD COLUMN     "publisher" TEXT,
ADD COLUMN     "rating" DECIMAL(65,30),
ADD COLUMN     "yearPublished" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Book.isbn10_unique" ON "Book"("isbn10");

-- CreateIndex
CREATE UNIQUE INDEX "Book.isbn13_unique" ON "Book"("isbn13");
