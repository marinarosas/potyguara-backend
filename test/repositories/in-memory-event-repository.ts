import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { EventsRepository } from "@/domain/forum/application/repositories/events-repository";
import { Event } from "@/domain/forum/enterprise/entities/event";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";
import { InMemoryEventAttachmentsRepository } from "./in-memory-event-attachments-repository";
import { EventDetails } from "@/domain/forum/enterprise/entities/value-objects/event-details";
import { InMemoryViewersRepository } from "./in-memory-viewer-repository";

export class InMemoryEventsRepository implements EventsRepository {
  public items: Event[] = [];

  constructor(
    private eventAttachmentsRepository: InMemoryEventAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private viewerRepository: InMemoryViewersRepository
  ) {}

  async findById(id: string) {
    const event = this.items.find((item) => item.id.toString() === id);

    if (!event) {
      return null;
    }

    return event;
  }

  async findBySlug(slug: string) {
    const event = this.items.find((item) => item.slug.value === slug);

    if (!event) {
      return null;
    }

    return event;
  }

  async findDetailsBySlug(slug: string) {
    const event = this.items.find((item) => item.slug.value === slug);

    if (!event) {
      return null;
    }

    const author = this.viewerRepository.items.find((artist) => {
      return artist.id.equals(event.authorId);
    });

    if (!author) {
      throw new Error(
        `Auhtor with ID "${event.authorId.toString()}" does not exist.`
      );
    }

    const eventAttachments = this.eventAttachmentsRepository.items.filter(
      (eventAttachment) => {
        return eventAttachment.eventId.equals(event.id);
      }
    );

    const attachments = eventAttachments.map((eventAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(eventAttachment.attachmentId);
      });

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${eventAttachment.attachmentId.toString()}" does not exist.`
        );
      }

      return attachment;
    });

    return EventDetails.create({
      eventId: event.id,
      authorId: event.authorId,
      author: author.name,
      title: event.title,
      content: event.content,
      slug: event.slug,
      price: event.price,
      statusPayment: event.statusPayment,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      attachments,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    });
  }

  async findManyRecent({ page }: PaginationParams) {
    const events = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return events;
  }

  async findManyByAuthorId(authorId: string, { page }: PaginationParams) {
    const events = this.items
      .filter((item) => item.authorId.toString() === authorId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return events;
  }

  async create(event: Event) {
    this.items.push(event);

    await this.eventAttachmentsRepository?.createMany(
      event.attachments.getItems()
    );

    DomainEvents.dispatchEventsForAggregate(event.id);
  }

  async save(event: Event): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === event.id);

    this.items[itemIndex] = event;

    await this.eventAttachmentsRepository.createMany(
      event.attachments.getNewItems()
    );

    await this.eventAttachmentsRepository.createMany(
      event.attachments.getRemovedItems()
    );

    DomainEvents.dispatchEventsForAggregate(event.id);
  }

  async delete(event: Event) {
    const itemIndex = this.items.findIndex((item) => item.id === event.id);

    this.items.splice(itemIndex, 1);

    this.eventAttachmentsRepository.deleteManyByEventId(event.id.toString());
  }
}
