/*
  Warnings:

  - You are about to drop the column `description` on the `Dispute` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Dispute` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[escrowId]` on the table `Dispute` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `disputedBy` to the `Dispute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `escrowId` to the `Dispute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `Dispute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resolution` to the `Dispute` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DisputeResolutions" AS ENUM ('PENDING', 'SENT_TO_BUYER', 'SENT_TO_SELLER', 'ERROR');

-- AlterTable
ALTER TABLE "Dispute" DROP COLUMN "description",
DROP COLUMN "status",
ADD COLUMN     "disputedBy" TEXT NOT NULL,
ADD COLUMN     "escrowId" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT NOT NULL,
DROP COLUMN "resolution",
ADD COLUMN     "resolution" "DisputeResolutions" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dispute_escrowId_key" ON "Dispute"("escrowId");

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "Escrow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
