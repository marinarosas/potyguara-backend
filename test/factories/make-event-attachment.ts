import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EventAttachment, EventAttachmentProps } from '@/domain/forum/enterprise/entities/event-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';


export function makeEventAttachment(
  override: Partial<EventAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const eventAttachment = EventAttachment.create(
    {
      eventId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return eventAttachment
}

@Injectable()
export class EventAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaEventAttachment(
    data: Partial<EventAttachmentProps> = {}
  ): Promise<EventAttachment> {
    const eventAttachment = makeEventAttachment(data);

    await this.prisma.attachment.update({
      where:{
        id: eventAttachment.attachmentId.toString(),
      },
      data: {
        eventId: eventAttachment.eventId.toString(),
      },
    });

    return eventAttachment;
  }
}
