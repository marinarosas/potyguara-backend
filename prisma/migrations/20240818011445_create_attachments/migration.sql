-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "event_id" TEXT,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
