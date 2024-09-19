import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Event,
  EventProps,
} from '@/domain/forum/enterprise/entities/event'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaEventMapper } from '@/infra/database/prisma/mapper/prisma-event-mapper'

export function makeEvent(
  override: Partial<EventProps> = {},
  id?: UniqueEntityID,
) {
  const event = Event.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentences(),
      content: faker.lorem.text(),
      price: 0,
      eventDate: faker.lorem.sentences(),
      eventTime: faker.lorem.sentences(),
      statusPayment: false, 
      ...override,
    },
    id,
  )

  return event
}

@Injectable()
export class EventFactory {
  constructor(private prisma: PrismaService){}

  async makePrismaEvent(data: Partial<EventProps> = {}): Promise<Event>{
    const event = makeEvent(data)

    await this.prisma.event.create({
      data: PrismaEventMapper.toPrisma(event)
    })

    return event
  }
}