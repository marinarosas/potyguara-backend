import { EventDetails } from "@/domain/forum/enterprise/entities/value-objects/event-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class EventDetailsPresenter {
  static toHTTP(eventDetails: EventDetails) {
    return {
      eventId: eventDetails.eventId.toString(),
      authorId: eventDetails.authorId.toString(),
      author: eventDetails.author,
      title: eventDetails.title,
      slug: eventDetails.slug,
      content: eventDetails.slug.value,
      price: eventDetails.price,
      statusPayment: eventDetails.statusPayment,
      eventDate: eventDetails.eventDate,
      eventTime: eventDetails.eventTime,
      attachments: eventDetails.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: eventDetails.createdAt,
      updatedAte: eventDetails.updatedAt,
    };
  }
}
