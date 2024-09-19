import { EventAttachment } from '../../enterprise/entities/event-attachment'

export abstract class EventAttachmentsRepository {
  abstract createMany(attachments: EventAttachment[]): Promise<void>
  abstract deleteMany(attachments: EventAttachment[]): Promise<void>

  abstract findManyByEventId(eventId: string): Promise<EventAttachment[]>
  abstract deleteManyByEventId(eventId: string): Promise<void>
}
