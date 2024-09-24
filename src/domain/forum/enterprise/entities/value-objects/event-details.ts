import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Slug } from './slug'
import { Attachment } from '../attachment'

export interface EventDetailsProps {
  eventId: UniqueEntityID
  authorId: UniqueEntityID
  author: string
  title: string
  content: string
  slug: Slug
  price: number
  statusPayment: boolean;
  eventDate: string;
  eventTime: string;
  attachments: Attachment[]
  createdAt: Date
  updatedAt?: Date | null
}
export class EventDetails extends ValueObject<EventDetailsProps> {
  get eventId() {
    return this.props.eventId
  }
  get authorId() {
    return this.props.authorId
  }
  get author() {
    return this.props.author
  }
  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get price() {
    return this.props.price
  }

  get statusPayment() {
    return this.props.statusPayment
  }

  get eventDate() {
    return this.props.eventDate
  }

  get eventTime() {
    return this.props.eventTime
  }

  get attachments() {
    return this.props.attachments
  }
  
  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: EventDetailsProps) {
    return new EventDetails(props)
  }
}