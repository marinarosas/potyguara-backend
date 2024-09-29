import { Either, right } from "@/core/either";
import { Event } from "../../enterprise/entities/event";
import { EventsRepository } from "../repositories/events-repository";
import { Injectable } from "@nestjs/common";

interface FetchEventsByAuhtorIdUseCaseRequest {
  authorId: string;
  page: number;
}

type FetchEventsByAuthorIdUseCaseResponse = Either<
  null,
  {
    events: Event[];
  }
>;

@Injectable()
export class FetchEventsByAuthorIdUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    authorId,
    page,
  }: FetchEventsByAuhtorIdUseCaseRequest): Promise<FetchEventsByAuthorIdUseCaseResponse> {
    const events = await this.eventsRepository.findManyByAuthorId(
      authorId,
      {
        page,
      }
    );

    return right({
      events,
    });
  }
}
