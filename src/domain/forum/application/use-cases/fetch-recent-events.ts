import { Either, right } from '@/core/either'
import { Event } from '../../enterprise/entities/event'
import { EventsRepository } from '../repositories/events-repository'
import { Injectable } from '@nestjs/common'

interface FetchRecentEventsUseCaseRequest {
  page: number
}

type FetchRecentEventsUseCaseResponse = Either<
  null,
  {
    events: Event[]
  }
>

@Injectable()
export class FetchRecentEventsUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    page,
  }: FetchRecentEventsUseCaseRequest): Promise<FetchRecentEventsUseCaseResponse> {
    const events = await this.eventsRepository.findManyRecent({
      page,
    })

    return right({
      events,
    })
  }
}
