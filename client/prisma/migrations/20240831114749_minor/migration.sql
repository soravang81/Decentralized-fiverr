/*
  Warnings:

  - You are about to drop the column `escrowId` on the `Dispute` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dispute" DROP CONSTRAINT "Dispute_escrowId_fkey";

-- DropIndex
DROP INDEX "Dispute_escrowId_key";

-- AlterTable
ALTER TABLE "Dispute" DROP COLUMN "escrowId";
