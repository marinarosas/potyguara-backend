import {
  BadRequestException,
  Controller,
  Get,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchRecentEventsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-events";
import { EventPresenter } from "../presenters/event-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/events")
export class FetchRecentEventsController {
  constructor(private fetchRecentQuestions: FetchRecentEventsUseCase) {}

  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentQuestions.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const events = result.value.events;

    return { events: events.map(EventPresenter.toHTTP) };
  }
}
