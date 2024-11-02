/*
  Warnings:

  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `friends` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `senderId` on the `Requests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `receiverId` on the `Requests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `UserRequests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_senderId_fkey";

-- DropForeignKey
ALTER TABLE "UserRequests" DROP CONSTRAINT "UserRequests_userId_fkey";

-- AlterTable
ALTER TABLE "Requests" DROP COLUMN "senderId",
ADD COLUMN     "senderId" INTEGER NOT NULL,
DROP COLUMN "receiverId",
ADD COLUMN     "receiverId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserRequests" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "friends",
ADD COLUMN     "friends" INTEGER[],
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRequests" ADD CONSTRAINT "UserRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
