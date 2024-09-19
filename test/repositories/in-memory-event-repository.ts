import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { EventAttachmentsRepository } from "@/domain/forum/application/repositories/event-attachments-repository";
import { EventsRepository } from "@/domain/forum/application/repositories/events-repository";
import { Event } from "@/domain/forum/enterprise/entities/event";

export class InMemoryEventsRepository implements EventsRepository {
  public items: Event[] = [];

  constructor(private eventAttachmentsRepository: EventAttachmentsRepository) {}

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

  async findManyRecent({ page }: PaginationParams) {
    const events = this.items
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
      event.attachments.getNewItems(),
    );

    await this.eventAttachmentsRepository.createMany(
      event.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(event.id);
  }

  async delete(event: Event) {
    const itemIndex = this.items.findIndex((item) => item.id === event.id);

    this.items.splice(itemIndex, 1);

    this.eventAttachmentsRepository.deleteManyByEventId(event.id.toString());
  }
}
