import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface EventAttachmentProps {
  eventId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export class EventAttachment extends Entity<EventAttachmentProps> {
  get eventId() {
    return this.props.eventId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static create(props: EventAttachmentProps, id?: UniqueEntityID) {
    const attachment = new EventAttachment(props, id);

    return attachment;
  }
}
