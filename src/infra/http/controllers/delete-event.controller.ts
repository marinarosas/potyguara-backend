import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteEventUseCase } from "@/domain/forum/application/use-cases/delete-event";

@Controller("/events/:id")
export class DeleteEventController {
  constructor(private deleteEvent: DeleteEventUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param("id") eventId: string) {
    const userId = user.sub;

    const result = await this.deleteEvent.execute({
      authorId: userId,
      eventId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
