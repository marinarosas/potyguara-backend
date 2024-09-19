import { Either, left, right } from '@/core/either'
import { Event } from '../../enterprise/entities/event'
import { EventsRepository } from '../repositories/events-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface GetEventBySlugUseCaseRequest {
  slug: string
}

type GetEventBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    event: Event
  }
>

@Injectable()
export class GetEventBySlugUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    slug,
  }: GetEventBySlugUseCaseRequest): Promise<GetEventBySlugUseCaseResponse> {
    const event = await this.eventsRepository.findBySlug(slug)

    if (!event) {
      return left(new ResourceNotFoundError())
    }

    return right({
      event,
    })
  }
}
