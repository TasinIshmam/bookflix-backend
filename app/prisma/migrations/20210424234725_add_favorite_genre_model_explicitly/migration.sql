/*
  Warnings:

  - You are about to drop the `_GenreToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FAVORITE_TYPE" AS ENUM ('USER_CHOICE', 'READING_BEHAVIOR');

-- DropForeignKey
ALTER TABLE "_GenreToUser" DROP CONSTRAINT "_GenreToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GenreToUser" DROP CONSTRAINT "_GenreToUser_B_fkey";

-- DropTable
DROP TABLE "_GenreToUser";

-- CreateTable
CREATE TABLE "FavoriteGenre" (
    "id" SERIAL NOT NULL,
    "genreId" INTEGER,
    "userId" INTEGER,
    "type" "FAVORITE_TYPE" DEFAULT E'USER_CHOICE',
    "relevance" INTEGER DEFAULT 0,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FavoriteGenre" ADD FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteGenre" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
