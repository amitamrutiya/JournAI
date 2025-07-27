-- AlterTable
ALTER TABLE "User" ADD COLUMN     "journalIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
