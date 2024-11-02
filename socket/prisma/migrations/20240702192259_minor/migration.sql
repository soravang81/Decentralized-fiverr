/*
  Warnings:

  - You are about to drop the column `url` on the `ProfilePics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProfilePics" DROP COLUMN "url",
ADD COLUMN     "link" TEXT NOT NULL DEFAULT 'https://firebasestorage.googleapis.com/v0/b/chatapp-4deee.appspot.com/o/ProfilePics%2Fdefault-pic.jpg?alt=media&token=53c51d35-079f-4e2e-addc-c6b40cfe8630';
