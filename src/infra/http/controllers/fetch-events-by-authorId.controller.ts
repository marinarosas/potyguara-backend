import {
  BadRequestException,
  Controller,
  Get,
  Query,
} from "@nestjs/common";
import { FetchEventsByAuthorIdUseCase } from "@/domain/forum/application/use-cases/fetch-events-by-authorId";
import { EventPresenter } from "../presenters/event-presenter";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/events/me")
export class FetchEventsByAuthorIdController {
  constructor(private fetchEventsByAuthorId: FetchEventsByAuthorIdUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query("page", queryValidationPipe) page: PageQueryParamSchema
  ) {
    const userId = user.sub;

    const result = await this.fetchEventsByAuthorId.execute({
      authorId: userId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const events = result.value.events;

    return { events: events.map(EventPresenter.toHTTP) };
  }
}
