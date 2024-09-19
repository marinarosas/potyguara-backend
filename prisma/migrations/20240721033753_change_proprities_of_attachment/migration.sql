/*
  Warnings:

  - You are about to drop the column `url` on the `attachements` table. All the data in the column will be lost.
  - Added the required column `link` to the `attachements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `attachements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachements" DROP COLUMN "url",
ADD COLUMN     "link" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
