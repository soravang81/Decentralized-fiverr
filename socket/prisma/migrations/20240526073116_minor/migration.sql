/*
  Warnings:

  - The `friends` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "friends",
ADD COLUMN     "friends" INTEGER[];
