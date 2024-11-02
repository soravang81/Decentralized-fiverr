/*
  Warnings:

  - You are about to drop the `Friendship` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_userID_fkey";

-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_userID_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "friends" TEXT[],
ADD COLUMN     "pendingRequests" TEXT[];

-- DropTable
DROP TABLE "Friendship";

-- DropTable
DROP TABLE "Requests";
