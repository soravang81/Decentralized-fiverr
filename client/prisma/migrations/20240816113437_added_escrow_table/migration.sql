-- CreateEnum
CREATE TYPE "EscrowStatus" AS ENUM ('PENDING', 'COMPLETED', 'DISPUTED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "EscrowUsers" AS ENUM ('CLIENT', 'RECEIVER');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "escrowId" TEXT;

-- CreateTable
CREATE TABLE "Escrow" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "EscrowStatus" NOT NULL DEFAULT 'PENDING',
    "sentTo" "EscrowUsers",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "transactionId" TEXT,

    CONSTRAINT "Escrow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Escrow_orderId_key" ON "Escrow"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Escrow_address_key" ON "Escrow"("address");

-- AddForeignKey
ALTER TABLE "Escrow" ADD CONSTRAINT "Escrow_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
