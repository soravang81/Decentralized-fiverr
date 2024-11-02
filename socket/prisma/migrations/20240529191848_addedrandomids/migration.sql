-- AlterTable
ALTER TABLE "Requests" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Requests_id_seq";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Users_id_seq";
