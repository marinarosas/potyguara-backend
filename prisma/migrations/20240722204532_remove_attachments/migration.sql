/*
  Warnings:

  - You are about to drop the column `attachmentId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the `attachements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_attachmentId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "attachmentId";

-- DropTable
DROP TABLE "attachements";
