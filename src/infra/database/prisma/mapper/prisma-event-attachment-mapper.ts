import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EventAttachment } from "@/domain/forum/enterprise/entities/event-attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaEventAttachmentMapper {
  static toDomain(raw: PrismaAttachment): EventAttachment {
    if (!raw.eventId) {
      throw new Error("Invalid attachment type.");
    }
    return EventAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        eventId: new UniqueEntityID(raw.eventId),
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrismaUpdateMany(attachments: EventAttachment[]): Prisma.AttachmentUpdateManyArgs  {

    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    return {
      where:{
        id: {
          in: attachmentIds,
        },
      },
      data: {
        eventId: attachments[0].eventId.toString(),
      }
    }
  }
}
