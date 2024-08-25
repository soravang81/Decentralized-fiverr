/*
  Warnings:

  - Made the column `transactionId` on table `Escrow` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'ACCEPTED';

-- AlterTable
ALTER TABLE "Escrow" ALTER COLUMN "transactionId" SET NOT NULL;
