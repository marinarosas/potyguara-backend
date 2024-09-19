-- CreateTable
CREATE TABLE "attachements" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "attachements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "attachements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
