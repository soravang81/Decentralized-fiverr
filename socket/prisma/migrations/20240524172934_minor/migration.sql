-- DropForeignKey
ALTER TABLE "UserRequests" DROP CONSTRAINT "UserRequests_requestId_fkey";

-- DropIndex
DROP INDEX "Requests_receiverId_key";

-- DropIndex
DROP INDEX "Requests_senderId_key";

-- AlterTable
ALTER TABLE "Requests" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "UserRequests" ADD CONSTRAINT "UserRequests_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
