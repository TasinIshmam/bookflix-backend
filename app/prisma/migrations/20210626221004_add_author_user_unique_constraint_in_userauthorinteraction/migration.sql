/*
  Warnings:

  - A unique constraint covering the columns `[authorId,userId]` on the table `UserAuthorInteraction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserAuthorInteraction.authorId_userId_unique" ON "UserAuthorInteraction"("authorId", "userId");
