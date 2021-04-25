/*
  Warnings:

  - Made the column `type` on table `FavoriteGenre` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FavoriteGenre" ALTER COLUMN "type" SET NOT NULL;
