/*
  Warnings:

  - A unique constraint covering the columns `[senderId]` on the table `Requests` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[receiverId]` on the table `Requests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "UserRequests" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "requestId" INTEGER NOT NULL,

    CONSTRAINT "UserRequests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Requests_senderId_key" ON "Requests"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "Requests_receiverId_key" ON "Requests"("receiverId");

-- AddForeignKey
ALTER TABLE "UserRequests" ADD CONSTRAINT "UserRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRequests" ADD CONSTRAINT "UserRequests_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Requests"("receiverId") ON DELETE RESTRICT ON UPDATE CASCADE;
