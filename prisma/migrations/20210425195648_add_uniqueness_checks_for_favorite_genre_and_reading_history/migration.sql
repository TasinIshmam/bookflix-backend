/*
  Warnings:

  - A unique constraint covering the columns `[genreId,userId]` on the table `FavoriteGenre` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookId,userId]` on the table `ReadingHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FavoriteGenre.genreId_userId_unique" ON "FavoriteGenre"("genreId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingHistory.bookId_userId_unique" ON "ReadingHistory"("bookId", "userId");
