/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[friendId]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Friends_userId_key" ON "Friends"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Friends_friendId_key" ON "Friends"("friendId");
