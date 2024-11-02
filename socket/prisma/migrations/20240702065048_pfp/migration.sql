/*
  Warnings:

  - Made the column `pfp` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "pfp" SET NOT NULL,
ALTER COLUMN "pfp" SET DEFAULT 'ProfilePics/default-pic.jpg';
