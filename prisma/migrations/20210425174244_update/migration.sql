/*
  Warnings:

  - The `type` column on the `FavoriteGenre` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FavoriteType" AS ENUM ('USER_CHOICE', 'READING_BEHAVIOR');

-- AlterTable
ALTER TABLE "FavoriteGenre" DROP COLUMN "type",
ADD COLUMN     "type" "FavoriteType" NOT NULL DEFAULT E'USER_CHOICE';

-- DropEnum
DROP TYPE "FAVORITE_TYPE";
