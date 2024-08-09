/*
  Warnings:

  - You are about to drop the column `solWalletId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `SolWallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SolWallet" DROP CONSTRAINT "SolWallet_userId_fkey";

-- DropIndex
DROP INDEX "User_solWalletId_key";

-- AlterTable
ALTER TABLE "PricingPackage" ALTER COLUMN "revisions" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "solWalletId";

-- DropTable
DROP TABLE "SolWallet";
