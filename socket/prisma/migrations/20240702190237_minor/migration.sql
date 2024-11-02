/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `ProfilePics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProfilePics_uid_key" ON "ProfilePics"("uid");
