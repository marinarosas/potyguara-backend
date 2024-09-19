import { EventAttachmentsRepository } from "@/domain/forum/application/repositories/event-attachments-repository";
import { EventAttachment } from "@/domain/forum/enterprise/entities/event-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaEventAttachmentMapper } from "../mapper/prisma-event-attachment-mapper";

@Injectable()
export class PrismaEventAttachemntsRepository
  implements EventAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByEventId(eventId: string): Promise<EventAttachment[]> {
    const eventAttachments = await this.prisma.attachment.findMany({
      where: {
        eventId,
      },
    });

    return eventAttachments.map(PrismaEventAttachmentMapper.toDomain);
  }

  async createMany(attachments: EventAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaEventAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(attachments: EventAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const attachmentIds = attachments.map((attachment) => {
      return attachment.id.toString()
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds
        }
      }
    })
  }

  async deleteManyByEventId(eventId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        eventId,
      },
    });
  }
}
