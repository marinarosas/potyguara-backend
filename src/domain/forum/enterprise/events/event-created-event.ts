import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Event } from '../entities/event'

export class EventCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public event: Event

  constructor(event: Event) {
    this.event = event
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.event.id
  }
}
