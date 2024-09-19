import { Either, left, right } from "@/core/either";
import { Event } from "../../enterprise/entities/event";
import {
  EventsRepository,
} from "../repositories/events-repository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { EventAttachmentList } from "../../enterprise/entities/event-attachment-list";
import { EventAttachment } from "../../enterprise/entities/event-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EventAttachmentsRepository } from "../repositories/event-attachments-repository";
import { Injectable } from "@nestjs/common";

interface EditEventUseCaseRequest {
  authorId: string;
  eventId: string;
  title: string;
  content: string;
  price: number;
  statusPayment: boolean;
  attachmentsIds: string[]
}

type EditEventUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    event: Event;
  }
>;

@Injectable()
export class EditEventUseCase {
  constructor(private eventsRepository: EventsRepository,
    private eventAttachmentsRepository: EventAttachmentsRepository,

  ) {}

  async execute({
    authorId,
    eventId,
    title,
    content,
    price,
    attachmentsIds,
  }: EditEventUseCaseRequest): Promise<EditEventUseCaseResponse> {
    const event = await this.eventsRepository.findById(eventId);

    if (!event) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== event.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentEventAttachments =
      await this.eventAttachmentsRepository.findManyByEventId(eventId)

    const eventAttachmentsList = new EventAttachmentList(
      currentEventAttachments,
    )

    const eventAttachments = attachmentsIds.map((attachmentId) => {
      return EventAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        eventId: event.id,
      })
    })

    eventAttachmentsList.update(eventAttachments)

    event.title = title;
    event.content = content;
    event.price = price
    event.attachments = eventAttachmentsList

    await this.eventsRepository.save(event);

    return right({ event });
  }
}
