/*
  Warnings:

  - You are about to drop the column `revisions` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `revisions` on the `PricingPackage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gig" DROP COLUMN "revisions";

-- AlterTable
ALTER TABLE "PricingPackage" DROP COLUMN "revisions";
