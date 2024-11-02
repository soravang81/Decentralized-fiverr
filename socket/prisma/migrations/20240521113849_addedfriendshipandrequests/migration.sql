/*
  Warnings:

  - You are about to drop the column `friends` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "friends";

-- CreateTable
CREATE TABLE "Friendship" (
    "id" SERIAL NOT NULL,
    "friends" TEXT[],
    "userID" INTEGER NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requests" (
    "id" SERIAL NOT NULL,
    "senders" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "pending" BOOLEAN NOT NULL,
    "senton" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accceptedon" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_userID_key" ON "Friendship"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Requests_userID_key" ON "Requests"("userID");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
