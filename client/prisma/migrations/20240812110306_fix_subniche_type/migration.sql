/*
  Warnings:

  - You are about to drop the column `bio` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `niche` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `SellerProfile` table. All the data in the column will be lost.
  - Changed the column `subNiche` on the `Gig` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.
  - Added the required column `description` to the `SellerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SellerProfile` table without a default value. This is not possible if the table is not empty.
  - Changed the column `subNiche` on the `SellerProfile` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterTable
ALTER TABLE "SellerProfile" ALTER COLUMN "subNiche" TYPE "SubNiche"[] USING ARRAY["subNiche"::text::"SubNiche"];
-- AlterTable
ALTER TABLE "SellerProfile" DROP COLUMN "bio",
DROP COLUMN "category",
DROP COLUMN "languages",
DROP COLUMN "niche",
DROP COLUMN "skills",
ADD COLUMN     "course" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "endDate" INTEGER,
ADD COLUMN     "institute" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "startDate" INTEGER,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "subNiche" SET DATA TYPE "SubNiche"[];
