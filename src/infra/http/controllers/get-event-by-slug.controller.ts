import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { GetEventBySlugUseCase } from "@/domain/forum/application/use-cases/get-event-by-slug";
import { EventDetailsPresenter } from "../presenters/event-details-presenter";

@Controller("/events/:slug")
export class GetEventBySlugController {
  constructor(private getEventBySlug: GetEventBySlugUseCase) {}

  @Get()
  async handle(@Param("slug") slug: string) {
    const result = await this.getEventBySlug.execute({
      slug,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { event: EventDetailsPresenter.toHTTP(result.value.event) };
  }
}
