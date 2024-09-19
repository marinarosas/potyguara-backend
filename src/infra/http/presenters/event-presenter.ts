import { Event } from "@/domain/forum/enterprise/entities/event";

export class EventPresenter {
  static toHTTP(event: Event) {
    return {
      id: event.id.toString(),
      title: event.title,
      slug: event.slug,
      content: event.slug.value,
      price: event.price,
      statusPayment: event.statusPayment,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      createdAt: event.createdAt,
      updatedAte: event.updatedAt,
    };
  }
}
