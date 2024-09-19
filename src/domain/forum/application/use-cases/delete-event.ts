import { Either, left, right } from '@/core/either'
import { EventsRepository } from '../repositories/events-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteEventUseCaseRequest {
  authorId: string
  eventId: string
}

type DeleteEventUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteEventUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    eventId,
    authorId,
  }: DeleteEventUseCaseRequest): Promise<DeleteEventUseCaseResponse> {
    const event = await this.eventsRepository.findById(eventId)

    if (!event) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== event.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.eventsRepository.delete(event)

    return right(null)
  }
}
