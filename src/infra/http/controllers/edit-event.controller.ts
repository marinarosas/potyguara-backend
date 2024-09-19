import { BadRequestException, Body, Controller, HttpCode, Param, Put } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { EditEventUseCase } from "@/domain/forum/application/use-cases/edit-event";

const editEventBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  price: z.number(),
  eventDate: z.string(),
  eventTime: z.string(),
  statusPayment: z.boolean(),
  attachments: z.array(z.string().uuid()),
});

type EditEventBodySchema = z.infer<typeof editEventBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editEventBodySchema);

@Controller("/events/:id")
export class EditEventController {
  constructor(private editEvent: EditEventUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditEventBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') eventId: string,
  ) {
    const { title, content, price, statusPayment, attachments } = body;
    const userId = user.sub;

   const result =  await this.editEvent.execute({
      authorId: userId,
      eventId: eventId,
      title,
      content,
      price,
      statusPayment,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
