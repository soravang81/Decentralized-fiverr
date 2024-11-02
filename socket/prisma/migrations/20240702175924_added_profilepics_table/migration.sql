/*
  Warnings:

  - You are about to drop the column `pfp` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "pfp";

-- CreateTable
CREATE TABLE "ProfilePics" (
    "id" SERIAL NOT NULL,
    "uid" INTEGER NOT NULL,
    "path" TEXT NOT NULL DEFAULT 'ProfilePics/default-pic.jpg',
    "url" TEXT NOT NULL DEFAULT 'https://firebasestorage.googleapis.com/v0/b/chatapp-4deee.appspot.com/o/ProfilePics%2Fdefault-pic.jpg?alt=media&token=53c51d35-079f-4e2e-addc-c6b40cfe8630',

    CONSTRAINT "ProfilePics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfilePics" ADD CONSTRAINT "ProfilePics_uid_fkey" FOREIGN KEY ("uid") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
