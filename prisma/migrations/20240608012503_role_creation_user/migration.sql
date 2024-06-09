-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ARTIST', 'VIEWER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'VIEWER';
