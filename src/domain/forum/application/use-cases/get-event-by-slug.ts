import { Either, left, right } from '@/core/either'
import { EventsRepository } from '../repositories/events-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { EventDetails } from '../../enterprise/entities/value-objects/event-details'

interface GetEventBySlugUseCaseRequest {
  slug: string
}

type GetEventBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    event: EventDetails
  }
>

@Injectable()
export class GetEventBySlugUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    slug,
  }: GetEventBySlugUseCaseRequest): Promise<GetEventBySlugUseCaseResponse> {
    const event = await this.eventsRepository.findDetailsBySlug(slug)

    if (!event) {
      return left(new ResourceNotFoundError())
    }

    return right({
      event,
    })
  }
}
