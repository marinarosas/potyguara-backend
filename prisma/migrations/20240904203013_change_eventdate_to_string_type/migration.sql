-- AlterTable
ALTER TABLE "events" ALTER COLUMN "event_date" DROP DEFAULT,
ALTER COLUMN "event_date" SET DATA TYPE TEXT;
