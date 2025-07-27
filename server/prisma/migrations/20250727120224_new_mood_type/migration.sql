-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Mood" ADD VALUE 'PEACEFUL';
ALTER TYPE "Mood" ADD VALUE 'GREATFUL';
ALTER TYPE "Mood" ADD VALUE 'FRUSTRATED';
ALTER TYPE "Mood" ADD VALUE 'WORRIED';
ALTER TYPE "Mood" ADD VALUE 'CONTENT';
ALTER TYPE "Mood" ADD VALUE 'LONELY';
ALTER TYPE "Mood" ADD VALUE 'OVERWHELMED';
ALTER TYPE "Mood" ADD VALUE 'HOPEFUL';
ALTER TYPE "Mood" ADD VALUE 'BORED';
ALTER TYPE "Mood" ADD VALUE 'TIRED';
