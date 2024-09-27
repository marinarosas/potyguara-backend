import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { EventsRepository } from '@/domain/forum/application/repositories/events-repository'
import { EventCreatedEvent } from '@/domain/forum/enterprise/events/event-created-event'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnEventCreated implements EventHandler {
  constructor(
    private eventsRepository: EventsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewEventNotification.bind(this),
      EventCreatedEvent.name,
    )
  }

  private async sendNewEventNotification({ event }: EventCreatedEvent) {
    const newEvent = await this.eventsRepository.findById(
      event.id.toString(),
    )

    if (newEvent) {
      await this.sendNotification.execute({
        recipientId: newEvent?.authorId.toString(),
        title: `Nova resposta em "${newEvent.title.substring(0, 40).concat('...')}"`,
        content: event.excerpt,
      })
    }
  }
}
