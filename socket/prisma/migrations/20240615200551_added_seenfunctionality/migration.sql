/*
  Warnings:

  - Added the required column `seen` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "seen" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Groupchat" ADD COLUMN     "seenBy" INTEGER[];
