/*
  Warnings:

  - You are about to drop the column `subCategory` on the `Gig` table. All the data in the column will be lost.
  - Added the required column `niche` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subNiche` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Gig` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Gig" DROP COLUMN "subCategory",
ADD COLUMN     "niche" "Niche" NOT NULL,
ADD COLUMN     "subNiche" "SubNiche" NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;
