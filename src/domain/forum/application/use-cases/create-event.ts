import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Event } from "../../enterprise/entities/event";
import { EventsRepository } from "../repositories/events-repository";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { EventAttachment } from "../../enterprise/entities/event-attachment";
import { EventAttachmentList } from "../../enterprise/entities/event-attachment-list";

interface CreateEventUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  price: number;
  eventDate: string;
  eventTime: string;
  statusPayment: boolean;
  attachmentsIds: string[];
}

type CreateEventUseCaseResponse = Either<
  null,
  {
    event: Event;
  }
>;

@Injectable()
export class CreateEventUseCase {
  constructor(private eventRepository: EventsRepository) {}

  async execute({
    authorId,
    title,
    content,
    price,
    eventDate,
    eventTime,
    statusPayment,
    attachmentsIds,
  }: CreateEventUseCaseRequest): Promise<CreateEventUseCaseResponse> {
    const event = Event.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
      price,
      eventDate,
      eventTime,
      statusPayment,
    });

    const eventAttachments = attachmentsIds.map((attachmentId) => {
      return EventAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        eventId: event.id,
      });
    });

    event.attachments = new EventAttachmentList(eventAttachments);
    
    await this.eventRepository.create(event);

    return right({
      event,
    });
  }
}
