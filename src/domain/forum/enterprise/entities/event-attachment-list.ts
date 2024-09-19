import { WatchedList } from '@/core/entities/watched-list'
import { EventAttachment } from './event-attachment'

export class EventAttachmentList extends WatchedList<EventAttachment> {
  compareItems(a: EventAttachment, b: EventAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
