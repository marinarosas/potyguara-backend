import { EventAttachmentsRepository } from "@/domain/forum/application/repositories/event-attachments-repository";
import { EventAttachment } from "@/domain/forum/enterprise/entities/event-attachment";

export class InMemoryEventAttachmentsRepository
  implements EventAttachmentsRepository
{
  public items: EventAttachment[] = [];

  async findManyByEventId(eventId: string) {
    const eventAttachment = this.items.filter(
      (item) => item.eventId.toString() === eventId
    );

    return eventAttachment;
  }

  async createMany(attachments: EventAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: EventAttachment[]): Promise<void> {
    const eventAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this.items = eventAttachments;
  }

  async deleteManyByEventId(eventId: string): Promise<void> {
    const eventAttachment = this.items.filter(
      (item) => item.eventId.toString() !== eventId
    );

    this.items = eventAttachment;
  }
}
