-- CreateEnum
CREATE TYPE "GigStatus" AS ENUM ('ACTIVE', 'DISCARDED');

-- AlterTable
ALTER TABLE "Gig" ADD COLUMN     "status" "GigStatus" NOT NULL DEFAULT 'ACTIVE';
