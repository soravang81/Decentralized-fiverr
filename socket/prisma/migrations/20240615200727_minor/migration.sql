-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "seen" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Groupchat" ALTER COLUMN "seenBy" SET DEFAULT ARRAY[]::INTEGER[];
