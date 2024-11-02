/*
  Warnings:

  - You are about to drop the column `lastSeen` on the `Friends` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Friends" DROP COLUMN "lastSeen";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "lastSeen" TIMESTAMP(3);
