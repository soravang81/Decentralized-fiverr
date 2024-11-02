/*
  Warnings:

  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_senderId_fkey";

-- DropForeignKey
ALTER TABLE "UserRequests" DROP CONSTRAINT "UserRequests_userId_fkey";

-- AlterTable
CREATE SEQUENCE requests_id_seq;
ALTER TABLE "Requests" ALTER COLUMN "id" SET DEFAULT nextval('requests_id_seq'),
ALTER COLUMN "senderId" SET DATA TYPE TEXT,
ALTER COLUMN "receiverId" SET DATA TYPE TEXT;
ALTER SEQUENCE requests_id_seq OWNED BY "Requests"."id";

-- AlterTable
ALTER TABLE "UserRequests" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "friends" SET DATA TYPE TEXT[],
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRequests" ADD CONSTRAINT "UserRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
