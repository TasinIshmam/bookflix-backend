/*
  Warnings:

  - Made the column `genreId` on table `FavoriteGenre` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `FavoriteGenre` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FavoriteGenre" ALTER COLUMN "genreId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;
