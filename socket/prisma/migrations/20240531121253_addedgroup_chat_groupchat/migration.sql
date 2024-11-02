/*
  Warnings:

  - You are about to drop the `UserRequests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRequests" DROP CONSTRAINT "UserRequests_requestId_fkey";

-- DropForeignKey
ALTER TABLE "UserRequests" DROP CONSTRAINT "UserRequests_userId_fkey";

-- DropTable
DROP TABLE "UserRequests";

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "message" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pfp" TEXT,
    "members" INTEGER[],
    "admins" INTEGER[],

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Groupchat" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "members" INTEGER[],
    "message" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Groupchat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Groupchat" ADD CONSTRAINT "Groupchat_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
