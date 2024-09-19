import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Event } from "@/domain/forum/enterprise/entities/event";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Event as PrismaEvent, Prisma } from "@prisma/client";

export class PrismaEventMapper {
  static toDomain(raw: PrismaEvent): Event {
    return Event.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        slug: Slug.create(raw.slug),
        price: raw.price,
        eventDate: raw.eventDate,
        eventTime: raw.eventTime,
        statusPayment: raw.statusPayment,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(event: Event): Prisma.EventUncheckedCreateInput {
    return {
      id: event.id.toString(),
      authorId: event.authorId.toString(),
      title: event.title,
      content: event.content,
      slug: event.slug.value,
      price: event.price,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      statusPayment: event.statusPayment,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
}
